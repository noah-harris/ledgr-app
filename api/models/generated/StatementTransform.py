from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StatementTransform(BaseModel):
    idUsers: UUID
    idStatementTransform: UUID
    TransformName: str
    TargetColumn: str
    Code: str
    Created: datetime
    Updated: datetime
