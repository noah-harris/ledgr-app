from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DocumentTagLinkView(BaseModel):
    idUsers: UUID
    idDocument: UUID
    idDocumentTag: UUID
    DocumentTagName: str
    isDefaultDocumentTag: Optional[Any] = None
    Created: datetime
    Updated: datetime
