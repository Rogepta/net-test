import enum
import math
from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from app.models import TicketPriority, TicketStatus


class SortBy(str, enum.Enum):
    created_at = "created_at"
    priority = "priority"


class SortOrder(str, enum.Enum):
    asc = "asc"
    desc = "desc"


class TicketCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(..., min_length=3, max_length=120)
    description: str | None = Field(None, max_length=1000)
    priority: TicketPriority = TicketPriority.normal


class TicketRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    status: TicketStatus
    priority: TicketPriority
    created_at: datetime
    updated_at: datetime

    @field_serializer("created_at", "updated_at")
    def serialize_utc(self, value: datetime) -> str:
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.isoformat()


class TicketStatusUpdate(BaseModel):
    status: TicketStatus


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PaginatedTickets(BaseModel):
    items: list[TicketRead]
    total: int
    page: int
    page_size: int
    total_pages: int

    @staticmethod
    def build(
        items: list[TicketRead], total: int, page: int, page_size: int
    ) -> "PaginatedTickets":
        return PaginatedTickets(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=math.ceil(total / page_size) if total else 0,
        )
