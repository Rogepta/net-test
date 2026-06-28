from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.auth import require_admin
from app.database import get_db
from app.models import Ticket, TicketPriority, TicketStatus


router = APIRouter(prefix="/tickets", tags=["tickets"])


def _get_ticket_or_404(db: Session, ticket_id: int) -> Ticket:
    ticket = crud.get_ticket(db, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заявка не найдена")
    return ticket


@router.post("", response_model=schemas.TicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(data: schemas.TicketCreate, db: Session = Depends(get_db)) -> Ticket:
    return crud.create_ticket(db, data)


@router.get("", response_model=schemas.PaginatedTickets)
def list_tickets(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    status: TicketStatus | None = None,
    priority: TicketPriority | None = None,
    search: str | None = None,
    sort_by: schemas.SortBy = schemas.SortBy.created_at,
    order: schemas.SortOrder = schemas.SortOrder.desc,
    db: Session = Depends(get_db),
) -> schemas.PaginatedTickets:
    items, total = crud.get_tickets(db, page, page_size, status, priority, search, sort_by, order)
    return schemas.PaginatedTickets.build(items, total, page, page_size)


@router.patch("/{ticket_id}/status", response_model=schemas.TicketRead)
def update_ticket_status(
    ticket_id: int,
    data: schemas.TicketStatusUpdate,
    db: Session = Depends(get_db),
) -> Ticket:
    ticket = _get_ticket_or_404(db, ticket_id)
    return crud.update_ticket_status(db, ticket, data.status)


@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(require_admin),
) -> None:
    ticket = _get_ticket_or_404(db, ticket_id)
    crud.delete_ticket(db, ticket)
