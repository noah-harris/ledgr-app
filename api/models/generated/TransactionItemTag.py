from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TransactionItemTag(BaseModel):
    idUsers: UUID
    idAccount: UUID
    idStatement: UUID
    idTransaction: UUID
    idTransactionItem: UUID
    idBudgetTag: UUID
    Value: Optional[str] = None
    hasAttributeValue: Any
    Created: datetime
    Updated: datetime
