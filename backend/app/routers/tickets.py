from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.post("", response_model=schemas.TicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(data: schemas.TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, data)


@router.get("", response_model=schemas.PaginatedTickets)
def list_tickets(page: int = 1, page_size: int = 20, db: Session = Depends(get_db)):
    items, total = crud.get_tickets(db, page, page_size)
    return schemas.PaginatedTickets.build(items, total, page, page_size)
