from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class File(BaseModel):
    idUsers: UUID
    idFile: UUID
    FileName: str
    FileExtension: str
    FullFileName: Optional[str] = None
    ServerFilePath: Optional[str] = None
    ContainerFilePath: Optional[str] = None
    DownloadEndpoint: Optional[str] = None
    FileSizeBytes: Optional[int] = None
    isSupportedImageExtension: Optional[bool] = None
    isJunk: bool
    AllowStatementImage: bool
    AllowAccountImage: bool
    AllowTransactionInvoiceImage: bool
    AllowTransactionReceiptImage: bool
    AllowDocument: bool
    isAllowedAll: Optional[bool] = None
    isAllowedAny: Optional[bool] = None
    Created: datetime
    Updated: datetime
