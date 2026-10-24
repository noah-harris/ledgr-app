from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AccountType(BaseModel):
    idAccountType: UUID
    AccountTypeName: str
    isCredit: bool
    isSpendable: bool
    Created: datetime
    Updated: datetime
