from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Users(BaseModel):
    idUsers: UUID
    Username: str
    Password: str
    FirstName: str
    LastName: str
    Email: Optional[str] = None
    Phone: Optional[str] = None
    ContainerDataPathRoot: Optional[Any] = None
    Created: datetime
    Updated: datetime
