from collections.abc import Generator
from contextlib import contextmanager
from sqlalchemy import create_engine, Connection, text
from sqlalchemy.engine import CursorResult, Engine
from sqlalchemy.sql.elements import TextClause
from sqlalchemy.exc import IntegrityError
from config import USERNAME, PASSWORD, EXTERNAL_HOST, EXTERNAL_PORT
from typing import Any

_engines: dict[str, Engine] = {}

def _get_engine(database: str) -> Engine:
    """
    One pooled engine per database, created on first use.
    """

    if database not in _engines:
        cxnstr = (
            f"mssql+pyodbc://{USERNAME}:{PASSWORD}@{EXTERNAL_HOST},{EXTERNAL_PORT}/{database}"
            "?driver=ODBC+Driver+17+for+SQL+Server&TrustServerCertificate=yes"
        )
        _engines[database] = create_engine(
            cxnstr,
            pool_pre_ping=True,
            pool_recycle=1800,
            connect_args={"timeout": 5},
        )
    return _engines[database]


def warm(database: str) -> None:
    """
    Build the engine ahead of first use so a bad config fails at startup.
    """

    _get_engine(database)
    return None


@contextmanager
def get_connection(database:str) -> Generator[Connection, None, None]:
    """
    Get a database connection from the connection pool.

    Yields:
        Connection: A database connection.
    """
    conn = _get_engine(database).connect()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def dispose_engines() -> None:
    """
    Close all pools. Called on application shutdown.
    """

    for engine in _engines.values():
        engine.dispose()
    _engines.clear()
    return None


def exec(statement:str, database:str='ldr', parameters:dict|None=None, execution_options:dict|None=None) -> list[dict] | None:
    """
    Execute a SQL statement against the specified database.

    Args:
        statement (str | TextClause): The SQL statement to execute.
        database (str): The target database name. Defaults to 'ldr'.
        parameters (dict | None): Parameters for the SQL statement. Defaults to None.
        execution_options (dict | None): Execution options for the SQL statement. Defaults to None.

    Returns:
        list[dict] | None: A list of dictionaries representing the result rows, or None if no rows are returned.
    """
    if not isinstance(statement, str):
        raise ValueError("The statement must be a string.")

    if isinstance(statement, str):
        statement = text(statement)

    with get_connection(database) as conn:
        try:
            result:CursorResult[Any] = conn.execute(statement, parameters or {}, execution_options=execution_options or {})
        except IntegrityError as e:
            raise e
        except Exception as e:
            raise RuntimeError(f"Error executing statement: {e}") from e
        else:
            rows = result.returns_rows
            return [dict(r) for r in result.mappings().all()] if rows else None
