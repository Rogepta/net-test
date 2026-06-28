from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db
from app.models import TicketPriority, TicketStatus

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.post("", response_model=schemas.TicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(data: schemas.TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, data)


@router.get("", response_model=schemas.PaginatedTickets)
def list_tickets(
    page: int = 1,
    page_size: int = Query(10, ge=1, le=100),
    status: TicketStatus | None = None,
    priority: TicketPriority | None = None,
    search: str | None = None,
    sort_by: schemas.SortBy = schemas.SortBy.created_at,
    order: schemas.SortOrder = schemas.SortOrder.desc,
    db: Session = Depends(get_db),
):
    items, total = crud.get_tickets(db, page, page_size, status, priority, search, sort_by, order)
    return schemas.PaginatedTickets.build(items, total, page, page_size)
