from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StatementLayout(BaseModel):
    idUsers: UUID
    idStatementLayout: UUID
    LayoutName: str
    Definition: str
    Created: datetime
    Updated: datetime
