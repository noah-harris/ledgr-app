from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Statement(BaseModel):
    idUsers: UUID
    idAccount: UUID
    idStatement: UUID
    idImage: Optional[UUID] = None
    StatementDate: date
    StartDate: datetime
    EndDate: datetime
    StartBalance: Decimal
    EndBalance: Decimal
    hasImage: Any
    Created: datetime
    Updated: datetime
