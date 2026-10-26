from ._imports import *

@app.get("/accounts", status_code=200, response_model=list[AccountView])
@catch("Failed to get accounts")
def get_accounts(current_user:dict=Depends(get_current_user)):
    res = exec (
        statement="""
            SELECT *
            FROM [usr].[v_Account]
            WHERE 1=1
                AND [idUsers] = :user_id
        """,
        database="ldr",
        parameters={
            "user_id": current_user["idUsers"]
        }
    )
    accounts = [AccountView(**row) for row in res]
    return accounts


@app.get("/account", status_code=200, response_model=AccountView)
@catch("Failed to get account")
def get_account(idAccount:str, current_user:dict=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT *
            FROM [usr].[v_Account]
            WHERE 1=1 
                AND [idUsers] = :user_id
                AND [idAccount] = :idAccount
        """,
        database="ldr",
        parameters={
            "user_id": current_user["idUsers"],
            "idAccount": idAccount
        }
    )
    if not res or len(res) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")
    account = AccountView(**res[0])
    return account


@app.get("/account/statements/latest", status_code=200, response_model=StatementView)
@catch("Failed to get latest account statement")
def get_latest_account_statement(idAccount:str, current_user:dict=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT TOP 1 *
            FROM [usr].[v_Statement]
            WHERE 1=1
                AND [idUsers] = :idUsers
                AND [idAccount] = :idAccount
            ORDER BY [EndDate] DESC
        """,
        database="ldr",
        parameters={
            "idUsers": current_user["idUsers"],
            "idAccount": idAccount
        }
    )
    if not res or len(res) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Client Error: 404 Not Found")
    statement = StatementView(**res[0])
    return statement



@app.get("/account/types", status_code=200, response_model=list[AccountType])
@catch("Failed to get account types")
def get_account_types(current_user:dict=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT * FROM [enum].[AccountType]
        """,
        database="ldr"
    )
    account_types = [AccountType(**row) for row in res]
    return account_types


@app.get("/account/subtypes", status_code=200, response_model=list[AccountSubType])
@catch("Failed to get account subtypes")
def get_account_subtypes(current_user:dict=Depends(get_current_user)):
    res = exec(
        statement="""
            SELECT * FROM [enum].[AccountSubType]
        """,
        database="ldr"
    )
    account_subtypes = [AccountSubType(**row) for row in res]
    return account_subtypes

