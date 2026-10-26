from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from .DocumentTagLinkView import DocumentTagLinkView as _DocumentTagLinkView

class Document(BaseModel):
    idUsers: UUID
    idDocument: UUID
    idFile: UUID
    Description: Optional[str] = None
    hasFile: Optional[bool] = None
    Created: datetime
    Updated: datetime
    Tags: List[_DocumentTagLinkView] = []
