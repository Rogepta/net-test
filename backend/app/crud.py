from sqlalchemy.orm import Session

from app.models import Ticket
from app.schemas import TicketCreate


def create_ticket(db: Session, data: TicketCreate) -> Ticket:
    ticket = Ticket(**data.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def get_tickets(db: Session, page: int, page_size: int) -> tuple[list[Ticket], int]:
    total = db.query(Ticket).count()
    items = db.query(Ticket).offset((page - 1) * page_size).limit(page_size).all()
    return items, total
