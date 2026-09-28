"""make realized_location optional

Revision ID: 2a0c55fc9189
Revises: 132c90d9bf67
Create Date: 2026-09-28 16:11:59.696459

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2a0c55fc9189'
down_revision: Union[str, Sequence[str], None] = '132c90d9bf67'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column("lost_items", "realized_location", nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column("lost_items", "realized_location", nullable=False)
