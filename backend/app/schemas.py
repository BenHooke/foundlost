from datetime import datetime

from geojson_pydantic import Point, Polygon
from pydantic import BaseModel

from app.models import ItemCategory


class LostItemCreate(BaseModel):
    name: str
    category: ItemCategory
    description: str
    last_had_location: Point
    realized_location: Point
    search_area: Polygon
    time_lost: datetime | None = None


class LostItemRead(BaseModel):
    id: int
    name: str
    category: ItemCategory
    description: str
    last_had_location: Point
    realized_location: Point
    search_area: Polygon
    time_lost: datetime
    time_posted: datetime


class FoundItemCreate(BaseModel):
    name: str
    category: ItemCategory
    description: str
    found_location: Point
    time_found: datetime | None = None


class FoundItemRead(BaseModel):
    id: int
    name: str
    category: ItemCategory
    description: str
    found_location: Point
    time_found: datetime
    time_posted: datetime
