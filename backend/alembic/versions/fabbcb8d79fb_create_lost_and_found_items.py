"""create lost and found items

Revision ID: fabbcb8d79fb
Revises:
Create Date: 2026-09-24 17:57:43.292862

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geometry
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'fabbcb8d79fb'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

ITEM_CATEGORY_VALUES = ("bag", "pet", "wallet", "keys", "electronics", "other")


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")

    postgresql.ENUM(*ITEM_CATEGORY_VALUES, name="item_category").create(op.get_bind(), checkfirst=True)
    item_category = postgresql.ENUM(*ITEM_CATEGORY_VALUES, name="item_category", create_type=False)

    op.create_table(
        "lost_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("category", item_category, nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("last_had_location", Geometry(geometry_type="POINT", srid=4326, spatial_index=False), nullable=False),
        sa.Column("realized_location", Geometry(geometry_type="POINT", srid=4326, spatial_index=False), nullable=False),
        sa.Column("search_area", Geometry(geometry_type="POLYGON", srid=4326, spatial_index=False), nullable=False),
        sa.Column("time_lost", sa.DateTime(timezone=True), nullable=False),
        sa.Column("time_posted", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_lost_items_last_had_location", "lost_items", ["last_had_location"], postgresql_using="gist")
    op.create_index("ix_lost_items_realized_location", "lost_items", ["realized_location"], postgresql_using="gist")
    op.create_index("ix_lost_items_search_area", "lost_items", ["search_area"], postgresql_using="gist")

    op.create_table(
        "found_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("category", item_category, nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("found_location", Geometry(geometry_type="POINT", srid=4326, spatial_index=False), nullable=False),
        sa.Column("time_found", sa.DateTime(timezone=True), nullable=False),
        sa.Column("time_posted", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_found_items_found_location", "found_items", ["found_location"], postgresql_using="gist")


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("found_items")
    op.drop_table("lost_items")
    postgresql.ENUM(*ITEM_CATEGORY_VALUES, name="item_category").drop(op.get_bind(), checkfirst=True)
