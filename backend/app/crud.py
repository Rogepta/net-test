from sqlalchemy import case
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Ticket, TicketPriority, TicketStatus, User
from app.schemas import SortBy, SortOrder, TicketCreate
from app.security import hash_password


class TicketDoneError(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


def _ensure_not_done(ticket: Ticket, action: str) -> None:
    if ticket.status == TicketStatus.done:
        raise TicketDoneError(f"Нельзя {action} завершённую заявку")


_PRIORITY_ORDER = case(
    (Ticket.priority == TicketPriority.low, 1),
    (Ticket.priority == TicketPriority.normal, 2),
    (Ticket.priority == TicketPriority.high, 3),
)

_LIKE_ESCAPE = "\\"


def _escape_like(term: str) -> str:
    return (
        term.replace(_LIKE_ESCAPE, _LIKE_ESCAPE * 2)
        .replace("%", f"{_LIKE_ESCAPE}%")
        .replace("_", f"{_LIKE_ESCAPE}_")
    )


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def ensure_admin_user(db: Session) -> None:
    if get_user_by_username(db, settings.admin_username) is not None:
        return
    db.add(
        User(
            username=settings.admin_username,
            hashed_password=hash_password(settings.admin_password),
            is_admin=True,
        )
    )
    db.commit()


def get_ticket(db: Session, ticket_id: int) -> Ticket | None:
    return db.get(Ticket, ticket_id)


def create_ticket(db: Session, data: TicketCreate) -> Ticket:
    ticket = Ticket(**data.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def update_ticket_status(db: Session, ticket: Ticket, status: TicketStatus) -> Ticket:
    _ensure_not_done(ticket, "изменить статус")
    ticket.status = status
    db.commit()
    db.refresh(ticket)
    return ticket


def delete_ticket(db: Session, ticket: Ticket) -> None:
    _ensure_not_done(ticket, "удалить")
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
        pattern = f"%{_escape_like(search)}%"
        q = q.filter(
            Ticket.title.ilike(pattern, escape=_LIKE_ESCAPE)
            | Ticket.description.ilike(pattern, escape=_LIKE_ESCAPE)
        )

    sort_col = _PRIORITY_ORDER if sort_by == SortBy.priority else Ticket.created_at
    primary = sort_col.desc() if order == SortOrder.desc else sort_col.asc()
    q = q.order_by(primary, Ticket.id.desc())

    total = q.count()
    items = q.offset((page - 1) * page_size).limit(page_size).all()
    return items, total
