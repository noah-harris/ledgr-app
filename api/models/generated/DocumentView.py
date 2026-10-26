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
    FullFileName: Optional[str] = None
    ServerFilePath: Optional[str] = None
    ContainerFilePath: Optional[str] = None
    DownloadEndpoint: Optional[str] = None
    FileSizeBytes: Optional[int] = None
    isSupportedImageExtension: Optional[bool] = None
    isJunk: bool
    Description: Optional[str] = None
    Created: datetime
    Updated: datetime
    Tags: List[_DocumentTagLinkView] = []
