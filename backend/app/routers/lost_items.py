from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.geo import point_from_wkb, polygon_from_wkb, to_wkb
from app.models import LostItem
from app.schemas import LostItemCreate, LostItemRead

router = APIRouter(prefix="/lost-items", tags=["lost-items"])


def _to_read(item: LostItem) -> LostItemRead:
    return LostItemRead(
        id=item.id,
        name=item.name,
        category=item.category,
        description=item.description,
        last_had_location=point_from_wkb(item.last_had_location),
        realized_location=point_from_wkb(item.realized_location),
        search_area=polygon_from_wkb(item.search_area),
        time_lost=item.time_lost,
        time_posted=item.time_posted,
    )


@router.post("", response_model=LostItemRead, status_code=201)
def create_lost_item(payload: LostItemCreate, db: Session = Depends(get_db)) -> LostItemRead:
    item = LostItem(
        name=payload.name,
        category=payload.category,
        description=payload.description,
        last_had_location=to_wkb(payload.last_had_location),
        realized_location=to_wkb(payload.realized_location),
        search_area=to_wkb(payload.search_area),
        time_lost=payload.time_lost or datetime.now(timezone.utc),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _to_read(item)


@router.get("", response_model=list[LostItemRead])
def list_lost_items(db: Session = Depends(get_db)) -> list[LostItemRead]:
    items = db.query(LostItem).order_by(LostItem.time_posted.desc()).all()
    return [_to_read(item) for item in items]


@router.get("/{item_id}", response_model=LostItemRead)
def get_lost_item(item_id: int, db: Session = Depends(get_db)) -> LostItemRead:
    item = db.get(LostItem, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Lost item not found")
    return _to_read(item)
