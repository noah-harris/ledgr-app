from ._imports_ import *
from fastapi import Depends

@app.get("/file-tag")
@catch("Failed to get file tags")
def get_file_tags(current_user:dict=Depends(get_current_user)):
    return exec(
        statement="""
            SELECT  
                [idFileTag] AS [id], 
                [FileTagName] AS [name], 
                [hasAttributeValue] AS [hasAttributeValue], 
                [isDefaultFileTag] AS [isDefaultFileTag]
            FROM [usr].[FileTag] 
            WHERE 1=2 
                OR [idUsers] = :user_id 
                OR [isDefaultFileTag] = 1
        """, 
        database="ldr", 
        parameters={
            "user_id": current_user["idUsers"]
        }
    )