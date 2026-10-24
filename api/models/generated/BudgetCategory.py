from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BudgetCategory(BaseModel):
    idBudgetCategory: UUID
    CategoryLevel1Name: str
    CategoryLevel2Name: Optional[str] = None
    CategoryLevel3Name: Optional[str] = None
    Created: datetime
    Updated: datetime
