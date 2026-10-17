from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class User(BaseModel):
    idUsers: UUID | None = None
    Username: str
    Password: str | None = None
    FirstName: str
    LastName: str
    Email: str | None = None
    Phone: str | None = None
    Created: datetime | None = None
    Updated: datetime | None = None
