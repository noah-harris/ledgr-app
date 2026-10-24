from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MerchantCategoryCode(BaseModel):
    Mcc: str
    idBudgetCategory: Optional[UUID] = None
    RangeStart: str
    RangeEnd: str
    RangeDescription: Optional[str] = None
    IsReserved: bool
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
