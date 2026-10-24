from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TransactionTag(BaseModel):
    idUsers: UUID
    idAccount: UUID
    idStatement: UUID
    idTransaction: UUID
    idBudgetTag: UUID
    Value: str
    hasAttributeValue: Any
    Created: datetime
    Updated: datetime
