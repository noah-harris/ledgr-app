from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TransactionType(BaseModel):
    idTransactionType: UUID
    Scope: str
    Cashflow: str
    isCashflowInName: bool
    Action: str
    isActionInName: bool
    Target: str
    isTargetInName: bool
    TransactionTypeName: Optional[str] = None
    requireTransactionItems: bool
    Description: str
    Sign: Optional[int] = None
    Created: datetime
    Updated: datetime
