from pydantic import BaseModel

class FileAllowance(BaseModel):
    AllowStatementImage: bool = False
    AllowAccountImage: bool = False
    AllowTransactionInvoiceImage: bool = False
    AllowTransactionReceiptImage: bool = False
    AllowDocument: bool = False