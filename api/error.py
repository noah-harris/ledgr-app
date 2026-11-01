import functools

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