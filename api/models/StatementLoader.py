from uuid import UUID
from pydantic import BaseModel

class StatementLoaderBox(BaseModel):
    page: int
    x0: float
    top: float
    x1: float
    bottom: float


class StatementLoaderAnchor(BaseModel):
    page: int
    text: str
    near_y: float


class StatementLoaderExtract(BaseModel):
    layout: dict
    overrides: dict = {}
    transforms: list[dict] = []
    preview_page: int = 1


class StatementTransformBody(BaseModel):
    TransformName: str
    TargetColumn: str
    Code: str


class StatementLayoutTransformBody(BaseModel):
    idStatementTransform: UUID
    isEnabled: bool = True


class StatementLayoutBody(BaseModel):
    LayoutName: str
    Definition: dict
    Transforms: list[StatementLayoutTransformBody] = []
