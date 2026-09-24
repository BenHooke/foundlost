from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.geo import point_from_wkb, to_wkb
from app.models import FoundItem
from app.schemas import FoundItemCreate, FoundItemRead

router = APIRouter(prefix="/found-items", tags=["found-items"])


def _to_read(item: FoundItem) -> FoundItemRead:
    return FoundItemRead(
        id=item.id,
        name=item.name,
        category=item.category,
        description=item.description,
        found_location=point_from_wkb(item.found_location),
        time_found=item.time_found,
        time_posted=item.time_posted,
    )


@router.post("", response_model=FoundItemRead, status_code=201)
def create_found_item(payload: FoundItemCreate, db: Session = Depends(get_db)) -> FoundItemRead:
    item = FoundItem(
        name=payload.name,
        category=payload.category,
        description=payload.description,
        found_location=to_wkb(payload.found_location),
        time_found=payload.time_found or datetime.now(timezone.utc),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _to_read(item)


@router.get("", response_model=list[FoundItemRead])
def list_found_items(db: Session = Depends(get_db)) -> list[FoundItemRead]:
    items = db.query(FoundItem).order_by(FoundItem.time_posted.desc()).all()
    return [_to_read(item) for item in items]


@router.get("/{item_id}", response_model=FoundItemRead)
def get_found_item(item_id: int, db: Session = Depends(get_db)) -> FoundItemRead:
    item = db.get(FoundItem, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Found item not found")
    return _to_read(item)
