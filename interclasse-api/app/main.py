from typing import Optional

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class ClassroomCreate(BaseModel):
    Name: str
    ID: str


class Classroom(ClassroomCreate):
    pass


class MatchCreate(BaseModel):
    homeTeam: str
    awayTeam: str
    date: str
    hour: str
    court: str


class Match(MatchCreate):
    id: int


app = FastAPI(title="Interclasse API", version="0.1.0")

# Development-friendly CORS. Restrict origins in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classrooms_db: list[Classroom] = []
matches_db: list[Match] = []
next_match_id = 1


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/classrooms")
def create_classroom(payload: ClassroomCreate) -> Classroom:
    classroom = Classroom(**payload.model_dump())
    classrooms_db.append(classroom)
    return classroom


@app.post("/matches")
def create_match(payload: MatchCreate) -> Match:
    global next_match_id
    match = Match(id=next_match_id, **payload.model_dump())
    matches_db.append(match)
    next_match_id += 1
    return match


@app.get("/matches")
def list_matches(_limit: Optional[int] = Query(default=None, ge=1)) -> list[Match]:
    if _limit is None:
        return matches_db
    return matches_db[:_limit]
