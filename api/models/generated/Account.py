from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Account(BaseModel):
    idUsers: UUID
    idAccount: UUID
    idAccountSubType: UUID
    idOrganization: UUID
    idCurrency: UUID
    idImage: Optional[UUID] = None
    AccountName: str
    StartDate: datetime
    EndDate: datetime
    LoginPage: Optional[str] = None
    Created: datetime
    Updated: datetime
