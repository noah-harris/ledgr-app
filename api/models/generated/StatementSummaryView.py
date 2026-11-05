from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StatementSummaryView(BaseModel):
    idUsers: UUID
    idAccount: UUID
    idStatement: UUID
    idImage: Optional[UUID] = None
    StatementDate: date
    StartDate: datetime
    EndDate: datetime
    PeriodLength: Optional[int] = None
    StartBalance: Decimal
    EndBalance: Decimal
    BalanceChange: Optional[Decimal] = None
    AmountWithdrawn: Optional[Decimal] = None
    AmountDeposited: Optional[Decimal] = None
    TotalWithdrawals: Optional[int] = None
    TotalDeposits: Optional[int] = None
    TotalTransactions: Optional[int] = None
    Created: datetime
    Updated: datetime
