from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PayeeView(BaseModel):
    idUsers: UUID
    idPayee: UUID
    PayeeName: Optional[str] = None
    PayeeType: str
    Created: Optional[datetime] = None
    Updated: Optional[datetime] = None
