from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StatementLayoutTransform(BaseModel):
    idUsers: UUID
    idStatementLayout: UUID
    idStatementTransform: UUID
    Position: int
    isEnabled: bool
    Created: datetime
    Updated: datetime
