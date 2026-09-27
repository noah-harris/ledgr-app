import sqlalchemy
import os
from sqlalchemy import text

DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
EXTERNAL_PORT = os.getenv("EXTERNAL_PORT")
INTERNAL_PORT = os.getenv("INTERNAL_PORT")
HOST = os.getenv("HOST")

try:

    CONN_STRING = f"mssql+pyodbc://{DB_USERNAME}:{DB_PASSWORD}@{HOST},{INTERNAL_PORT}/ldr?driver=ODBC+Driver+17+for+SQL+Server&TrustServerCertificate=yes"
    engine = sqlalchemy.create_engine(CONN_STRING, pool_pre_ping=True, connect_args={"timeout": 5})
    conn:sqlalchemy.engine.Connection = engine.connect()
    conn:sqlalchemy.engine.Connection = conn.execution_options(isolation_level="AUTOCOMMIT")
    conn.execute(text(f"""
        EXEC sp_addlinkedserver 
            @server = 'l',
            @srvproduct = '',
            @provider = 'MSOLEDBSQL',
            @datasrc = 'local.harrisnet,1435',
            @provstr = 'TrustServerCertificate=yes;Encrypt=no';

        EXEC sp_addlinkedsrvlogin 
            @rmtsrvname = 'l',
            @useself = 'FALSE',
            @locallogin = NULL,
            @rmtuser = '{DB_USERNAME}',
            @rmtpassword = '{DB_PASSWORD}';
        """))

finally:
    conn.close()
    engine.dispose()