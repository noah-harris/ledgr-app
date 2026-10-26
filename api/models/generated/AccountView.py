from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AccountView(BaseModel):
    idUsers: UUID
    idAccount: UUID
    idAccountType: UUID
    idAccountSubType: UUID
    idCurrency: UUID
    idImage: Optional[UUID] = None
    AccountName: str
    StartDate: datetime
    EndDate: datetime
    LoginPage: Optional[str] = None
    OrganizationName: str
    Mcc: Optional[str] = None
    AccountTypeName: str
    AccountSubTypeName: str
    Description: str
    isCredit: bool
    isSpendable: bool
    Symbol: str
    CurrencyName: str
    CurrencyNamePlural: str
    FullFileName: Optional[str] = None
    DownloadEndpoint: Optional[str] = None
    FileSizeBytes: Optional[int] = None
    Created: datetime
    Updated: datetime
