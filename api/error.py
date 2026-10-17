import functools
# from fastapi import HTTPException, status
# import logging
# import re
# from sqlalchemy.exc import IntegrityError, DataError, OperationalError, ProgrammingError, StatementError

# # SQL Server error numbers worth naming
# SQL_ERRORS = {
#     2627: (status.HTTP_409_CONFLICT, "That record already exists"),
#     2601: (status.HTTP_409_CONFLICT, "That record already exists"),
#     547:  (status.HTTP_400_BAD_REQUEST, "Referenced record does not exist"),
#     515:  (status.HTTP_400_BAD_REQUEST, "A required field was missing"),
#     8152: (status.HTTP_400_BAD_REQUEST, "A value was too long for its field"),
#     242:  (status.HTTP_400_BAD_REQUEST, "Invalid date value"),
# }

# CATEGORY_ERRORS = {
#     IntegrityError:   (status.HTTP_409_CONFLICT, "Conflicts with existing data"),
#     DataError:        (status.HTTP_400_BAD_REQUEST, "Invalid value for one or more fields"),
#     OperationalError: (status.HTTP_503_SERVICE_UNAVAILABLE, "Database unavailable"),
#     ProgrammingError: (status.HTTP_500_INTERNAL_SERVER_ERROR, "Server error"),
#     StatementError:   (status.HTTP_500_INTERNAL_SERVER_ERROR, "Server error"),
# }


# def db_error(exc:Exception, context: str = "") -> HTTPException:
#     """
#     Translate a database exception into an HTTPException.
#     """
    
#     logging.exception("Database error%s", f" in {context}" if context else "")

#     number = _sql_error_number(exc)
#     if number in SQL_ERRORS:
#         code, detail = SQL_ERRORS[number]
#         return HTTPException(code, detail)

#     for exc_type, (code, detail) in CATEGORY_ERRORS.items():
#         if isinstance(exc, exc_type):
#             return HTTPException(code, detail)

#     return HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Unexpected server error")


# def _sql_error_number(exc: Exception) -> int | None:
#     """
#     pyodbc packs the SQL Server error number into args[1] of the original exception.
#     """

#     orig = getattr(exc, "orig", None)
#     if orig is None or not orig.args:
#         return None
#     message = str(orig.args[-1])
#     match = re.search(r"\((\d+)\)", message)      # e.g. "... (2627) (SQLExecDirectW)"
#     return int(match.group(1)) if match else None


def catch(message: str):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                raise RuntimeError(f"{message}: {e}") from e
        return wrapper
    return decorator