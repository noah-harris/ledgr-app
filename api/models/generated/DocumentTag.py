from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DocumentTag(BaseModel):
    idUsers: Optional[UUID] = None
    idDocumentTag: UUID
    DocumentTagName: str
    isDefaultDocumentTag: Optional[bool] = None
    Created: datetime
    Updated: datetime
