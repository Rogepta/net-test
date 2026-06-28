from fastapi import FastAPI

from app.database import Base, engine
from app.models import Ticket  # noqa: F401
from app.routers import tickets

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(tickets.router)


@app.get("/health")
def health():
    return {"status": "ok"}
