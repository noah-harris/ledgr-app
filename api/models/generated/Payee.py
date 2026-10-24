from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Payee(BaseModel):
    idUsers: UUID
    idPayee: UUID
    PayeeType: str
    Created: datetime
    Updated: datetime
