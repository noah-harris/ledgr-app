from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Calendar(BaseModel):
    Date: date
    DayOfWeek: int
    DayOfMonth: int
    DayOfYear: int
    WeekOfYear: int
    Month: int
    Quarter: int
    Year: int
    DayName: str
    DayNameShort: str
    MonthName: str
    MonthNameShort: str
    MonthYear: str
    QuarterLabel: str
    MonthKey: int
    QuarterKey: int
    YearKey: int
    FiscalMonth: int
    FiscalQuarter: int
    FiscalYear: int
    FiscalYearLabel: str
    IsWeekend: bool
    IsWeekday: bool
    IsHoliday: bool
    HolidayName: Optional[str] = None
    IsBusinessDay: bool
    IsLeapYear: bool
    IsLastDayOfMonth: bool
    IsFirstDayOfMonth: bool
    FirstDayOfMonth: date
    LastDayOfMonth: date
    FirstDayOfQuarter: date
    LastDayOfQuarter: date
    FirstDayOfYear: date
    LastDayOfYear: date
