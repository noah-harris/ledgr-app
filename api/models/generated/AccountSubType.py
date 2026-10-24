from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AccountSubType(BaseModel):
    idAccountType: UUID
    idAccountSubType: UUID
    AccountSubTypeName: str
    Description: str
    Created: datetime
    Updated: datetime
