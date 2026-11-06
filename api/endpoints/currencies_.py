from ._imports import *

@app.get("/currencies", status_code=200, response_model=list[Currency])
@catch("Failed to get currencies")
def get_currencies(current_user:Users=Depends(get_current_user)):
    result = exec(
        statement="""
            SELECT *
            FROM [usr].[Currency]
        """,
        database="ldr"
    )
    return [Currency(**row) for row in result]