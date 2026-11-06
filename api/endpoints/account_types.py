from ._imports import *

@app.get("/account/types", status_code=200, response_model=list[AccountType])
@catch("Failed to get account types")
def get_account_types(current_user:Users=Depends(get_current_user)):
    result = exec(
        statement="""
            SELECT * FROM [enum].[AccountType]
        """,
        database="ldr"
    )
    return [AccountType(**row) for row in result]
