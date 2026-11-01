from ._imports import *

@app.get("/user", response_model=Users)
def get_user(current_user:Users=Depends(get_current_user)):
    return current_user
