from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Unit(BaseModel):
    idUnit: UUID
    UnitType: str
    Symbol: str
    UnitAbbreviation: str
    UnitName: str
    UnitNamePlural: str
    ConversionFactor: float
    isBaseUnit: Optional[Any] = None
    isCurrency: Optional[Any] = None
    Created: datetime
    Updated: datetime
