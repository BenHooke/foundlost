import enum
from datetime import datetime

from geoalchemy2 import Geometry
from sqlalchemy import DateTime, Enum, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class ItemCategory(str, enum.Enum):
    bag = "bag"
    pet = "pet"
    wallet = "wallet"
    keys = "keys"
    electronics = "electronics"
    other = "other"


class LostItem(Base):
    __tablename__ = "lost_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    category: Mapped[ItemCategory] = mapped_column(Enum(ItemCategory, name="item_category"))
    description: Mapped[str] = mapped_column(Text)

    last_had_location = mapped_column(Geometry(geometry_type="POINT", srid=4326, spatial_index=False))
    realized_location = mapped_column(Geometry(geometry_type="POINT", srid=4326, spatial_index=False))
    search_area = mapped_column(Geometry(geometry_type="POLYGON", srid=4326, spatial_index=False))

    time_lost: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    time_posted: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class FoundItem(Base):
    __tablename__ = "found_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    category: Mapped[ItemCategory] = mapped_column(Enum(ItemCategory, name="item_category"))
    description: Mapped[str] = mapped_column(Text)

    found_location = mapped_column(Geometry(geometry_type="POINT", srid=4326, spatial_index=False))

    time_found: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    time_posted: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
