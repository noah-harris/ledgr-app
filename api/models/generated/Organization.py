from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Organization(BaseModel):
    idUsers: UUID
    idOrganization: UUID
    Mcc: Optional[str] = None
    OrganizationName: str
    Created: datetime
    Updated: datetime
