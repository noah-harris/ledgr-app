from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TransactionItem(BaseModel):
    idUsers: UUID
    idAccount: UUID
    idStatement: UUID
    idTransaction: UUID
    idTransactionItem: UUID
    idTransactionItemType: UUID
    idCurrency: UUID
    idQuantityUnit: Optional[UUID] = None
    ItemName: str
    ItemDescription: Optional[str] = None
    Amount: Decimal
    Quantity: Optional[Decimal] = None
    Created: datetime
    Updated: datetime
