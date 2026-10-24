from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TransactionGroup(BaseModel):
    idUsers: UUID
    idTransactionGroup: UUID
    idTransactionGroupType: UUID
    Description: Optional[str] = None
    Created: datetime
    Updated: datetime
