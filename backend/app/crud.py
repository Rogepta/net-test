from sqlalchemy import case
from sqlalchemy.orm import Session

from app.models import Ticket, TicketPriority, TicketStatus
from app.schemas import SortBy, SortOrder, TicketCreate

_PRIORITY_ORDER = case(
    (Ticket.priority == TicketPriority.low, 1),
    (Ticket.priority == TicketPriority.normal, 2),
    (Ticket.priority == TicketPriority.high, 3),
)


def create_ticket(db: Session, data: TicketCreate) -> Ticket:
    ticket = Ticket(**data.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def update_ticket_status(db: Session, ticket: Ticket, status: TicketStatus) -> Ticket:
    ticket.status = status
    db.commit()
    db.refresh(ticket)
    return ticket


def delete_ticket(db: Session, ticket: Ticket) -> None:
    db.delete(ticket)
    db.commit()


def get_tickets(
    db: Session,
    page: int,
    page_size: int,
    status: TicketStatus | None,
    priority: TicketPriority | None,
    search: str | None,
    sort_by: SortBy,
    order: SortOrder,
) -> tuple[list[Ticket], int]:
    q = db.query(Ticket)

    if status is not None:
        q = q.filter(Ticket.status == status)
    if priority is not None:
        q = q.filter(Ticket.priority == priority)
    if search:
        q = q.filter(
            Ticket.title.ilike(f"%{search}%") | Ticket.description.ilike(f"%{search}%")
        )

    sort_col = _PRIORITY_ORDER if sort_by == SortBy.priority else Ticket.created_at
    q = q.order_by(sort_col.desc() if order == SortOrder.desc else sort_col.asc())

    total = q.count()
    items = q.offset((page - 1) * page_size).limit(page_size).all()
    return items, total
