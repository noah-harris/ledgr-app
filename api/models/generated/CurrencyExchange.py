from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CurrencyExchange(BaseModel):
    idCurrencyFrom: UUID
    idCurrencyTo: UUID
    Date: date
    ExchangeRate: float
    Created: datetime
    Updated: datetime
