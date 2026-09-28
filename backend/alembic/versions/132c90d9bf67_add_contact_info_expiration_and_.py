"""add contact info expiration and optional search area

Revision ID: 132c90d9bf67
Revises: 1b05f8163646
Create Date: 2026-09-28 15:55:23.544655

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '132c90d9bf67'
down_revision: Union[str, Sequence[str], None] = '1b05f8163646'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

EXPIRES_AT_DEFAULT = sa.text("now() + interval '30 days'")


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("lost_items", sa.Column("contact_info", sa.String(length=255), nullable=False))
    op.add_column(
        "lost_items",
        sa.Column("expires_at", sa.DateTime(timezone=True), server_default=EXPIRES_AT_DEFAULT, nullable=False),
    )
    op.alter_column("lost_items", "search_area", nullable=True)

    op.add_column("found_items", sa.Column("contact_info", sa.String(length=255), nullable=False))
    op.add_column(
        "found_items",
        sa.Column("expires_at", sa.DateTime(timezone=True), server_default=EXPIRES_AT_DEFAULT, nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("found_items", "expires_at")
    op.drop_column("found_items", "contact_info")

    op.alter_column("lost_items", "search_area", nullable=False)
    op.drop_column("lost_items", "expires_at")
    op.drop_column("lost_items", "contact_info")
