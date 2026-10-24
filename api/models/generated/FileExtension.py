from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FileExtension(BaseModel):
    FileExtension: str
    MimeType: str
    isSupportedImageExtension: bool
    Created: datetime
    Updated: datetime
