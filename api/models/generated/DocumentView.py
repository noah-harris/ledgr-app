from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from .DocumentTagLinkView import DocumentTagLinkView as _DocumentTagLinkView

class DocumentView(BaseModel):
    idUsers: UUID
    idFile: UUID
    idDocument: UUID
    FileName: str
    FileExtension: str
    FullFileName: Optional[Any] = None
    ServerFilePath: Optional[Any] = None
    ContainerFilePath: Optional[Any] = None
    DownloadEndpoint: Optional[Any] = None
    FileSizeBytes: Optional[int] = None
    isSupportedImageExtension: Optional[Any] = None
    isJunk: bool
    Description: Optional[str] = None
    Created: datetime
    Updated: datetime
    Tags: List[_DocumentTagLinkView] = []
