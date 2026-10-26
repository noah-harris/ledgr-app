from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OrganizationView(BaseModel):
    idUsers: UUID
    idOrganization: UUID
    OrganizationName: str
    Mcc: Optional[str] = None
    RangeStart: Optional[str] = None
    RangeEnd: Optional[str] = None
    RangeDescription: Optional[str] = None
    IsReserved: Optional[bool] = None
    IsoDescription: Optional[str] = None
    UsdaDescription: Optional[str] = None
    StripeDescription: Optional[str] = None
    StripeCode: Optional[str] = None
    VisaDescription: Optional[str] = None
    VisaReqClearingName: Optional[str] = None
    AlipayDescription: Optional[str] = None
    MastercardDescription: Optional[str] = None
    MastercardAbbrAirlineName: Optional[str] = None
    AmexDescription: Optional[str] = None
