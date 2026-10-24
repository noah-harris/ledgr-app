from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TransactionType(BaseModel):
    idTransactionType: UUID
    TransactionTypeName: str
    Scope: str
    Cashflow: str
    isPositive: Optional[Any] = None
    isItemEntryRequired: Optional[bool] = None
    Description: str
    Created: datetime
    Updated: datetime
