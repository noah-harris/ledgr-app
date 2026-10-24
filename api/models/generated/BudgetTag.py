from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BudgetTag(BaseModel):
    idUsers: Optional[UUID] = None
    idBudgetTag: UUID
    idBudgetCategory: Optional[UUID] = None
    BudgetTagName: str
    hasAttributeValue: bool
    isIncludedInBudget: Any
    isDefaultBudgetTag: Optional[Any] = None
    Created: datetime
    Updated: datetime
