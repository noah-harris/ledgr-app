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
    FullFileName: Optional[Any] = None
    ServerFilePath: Optional[Any] = None
    ContainerFilePath: Optional[Any] = None
    DownloadEndpoint: Optional[Any] = None
    FileSizeBytes: Optional[int] = None
    isSupportedImageExtension: Optional[Any] = None
    isJunk: bool
    AllowStatementImage: bool
    AllowAccountImage: bool
    AllowTransactionInvoiceImage: bool
    AllowTransactionReceiptImage: bool
    AllowDocument: bool
    isAllowedAll: Optional[Any] = None
    isAllowedAny: Optional[Any] = None
    Created: datetime
    Updated: datetime
