from ._imports import *

@app.get("/currencies", status_code=200, response_model=list[Currency])
@catch("Failed to get currencies")
def get_currencies(current_user:dict=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT *
            FROM [usr].[Currency]
        """,
        database="ldr"
    )
    currencies = [Currency(**row) for row in res]
    return currencies