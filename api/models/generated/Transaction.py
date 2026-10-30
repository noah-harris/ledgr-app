from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Transaction(BaseModel):
    idUsers: UUID
    idAccount: UUID
    idStatement: UUID
    idTransaction: UUID
    idTransactionGroup: Optional[UUID] = None
    idTransactionParent: Optional[UUID] = None
    idTransactionType: UUID
    idPayee: UUID
    idImageInvoice: Optional[UUID] = None
    idImageReceipt: Optional[UUID] = None
    TransactionDate: datetime
    PostDate: date
    InvoiceDate: Optional[datetime] = None
    DueDate: Optional[date] = None
    StartDate: Optional[datetime] = None
    EndDate: Optional[datetime] = None
    Amount: Decimal
    StatementText: Optional[str] = None
    isValidated: Optional[bool] = None
    isTransactionSplitChild: Optional[bool] = None
    hasInvoiceImage: Optional[bool] = None
    hasReceiptImage: Optional[bool] = None
    Created: datetime
    Updated: datetime
