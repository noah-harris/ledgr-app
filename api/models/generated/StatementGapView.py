from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StatementGapView(BaseModel):
    idUsers: Optional[UUID] = None
    idAccount: Optional[UUID] = None
    GapStartDate: Optional[datetime] = None
    GapEndDate: Optional[datetime] = None
    GapDurationDays: Optional[int] = None
