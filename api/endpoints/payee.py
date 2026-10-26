from ._imports import *

# @app.get("/payees", status_code=200, response_model=List[Payee])
# @catch()
# def get_payees(current_user:Users=Depends(get_current_user)):
#     res = exec(
#         statement = "SELECT * FROM [usr].[v_Payee] WHERE [idUsers] = :idUsers",
#         database = "ldr",
#         parameters = {"idUsers": current_user.idUsers}
#     )
#     payees = [Payee(**row) for row in res]
#     return payees