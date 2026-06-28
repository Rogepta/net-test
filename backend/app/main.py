from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app import crud
from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import Ticket, User  # noqa: F401
from app.routers import auth, tickets

settings.validate()

Base.metadata.create_all(bind=engine)

with SessionLocal() as _db:
    crud.ensure_admin_user(_db)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.exception_handler(crud.TicketDoneError)
def ticket_done_handler(request: Request, exc: crud.TicketDoneError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT, content={"detail": exc.message}
    )


app.include_router(auth.router)
app.include_router(tickets.router)


@app.get("/health")
def health():
    return {"status": "ok"}
