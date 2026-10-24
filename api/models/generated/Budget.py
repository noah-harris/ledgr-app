from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Budget(BaseModel):
    idUsers: UUID
    idBudget: UUID
    BudgetName: str
    Description: Optional[str] = None
    StartDate: datetime
    EndDate: datetime
    Created: datetime
    Updated: datetime
