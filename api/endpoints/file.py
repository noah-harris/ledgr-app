from ._imports import *

@app.get("/files")
@catch("Failed to get files")
def get_files(current_user:dict=Depends(get_current_user)):
    return exec(
        statement="""
            SELECT  
                [idFile] AS [id], 
                [FileName] AS [name], 
                [FileExtension] AS [extension], 
                [FileSizeBytes] AS [size]
            FROM [usr].[File] 
            WHERE [idUsers] = :user_id
        """, 
        database="ldr", 
        parameters={
            "user_id": current_user["idUsers"]
        }
    )

# @app.get("/file")
# @catch("Failed to get file")
# def get_file(idFile:str, current_user:dict=Depends(get_current_user), ):
#     return exec(
#         statement="""
#             SELECT  
#                 [idFile] AS [id], 
#                 [FileName] AS [name], 
#                 [FileExtension] AS [extension], 
#                 [FileSizeBytes] AS [size]
#             FROM [usr].[File] 
#             WHERE 1=1 
#                 AND [idUsers] = :user_id
#                 AND [idFile] = :idFile
#         """, 
#         database="ldr", 
#         parameters={
#             "user_id": current_user["idUsers"],
#             "idFile": idFile
#         }
#     )