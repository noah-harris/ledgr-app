from ._imports import *

@app.get("/account/subtypes", status_code=200, response_model=list[AccountSubType])
@catch("Failed to get account subtypes")
def get_account_subtypes(current_user:Users=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT * FROM [enum].[AccountSubType]
        """,
        database="ldr"
    )
    account_subtypes = [AccountSubType(**row) for row in res]
    return account_subtypes
