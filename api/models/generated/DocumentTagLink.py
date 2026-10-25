from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DocumentTagLink(BaseModel):
    idUsers: UUID
    idDocument: UUID
    idDocumentTag: UUID
    Created: datetime
    Updated: datetime
