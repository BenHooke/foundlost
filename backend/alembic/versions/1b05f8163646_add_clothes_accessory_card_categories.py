"""add clothes accessory card categories

Revision ID: 1b05f8163646
Revises: fabbcb8d79fb
Create Date: 2026-09-28 15:30:40.209629

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1b05f8163646'
down_revision: Union[str, Sequence[str], None] = 'fabbcb8d79fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

NEW_VALUES = ("clothes", "accessory", "card")


def upgrade() -> None:
    """Upgrade schema."""
    for value in NEW_VALUES:
        op.execute(f"ALTER TYPE item_category ADD VALUE IF NOT EXISTS '{value}'")


def downgrade() -> None:
    """Downgrade schema."""
    # PostgreSQL does not support removing values from an enum type without
    # recreating it. Left as a no-op; a real rollback would need to recreate
    # item_category from scratch and remap any rows using the new values.
    pass
