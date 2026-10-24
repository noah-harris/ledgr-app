from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Contact(BaseModel):
    idUsers: UUID
    idContact: UUID
    FirstName: str
    LastName: str
    Email: Optional[str] = None
    Phone: Optional[str] = None
    Address: Optional[str] = None
    Relationship: Optional[str] = None
    Created: datetime
    Updated: datetime
