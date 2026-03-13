from typing import Optional

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    username: str
    email: EmailStr


class User(UserCreate):
    id: int


class PostCreate(BaseModel):
    title: str
    body: str
    userId: int


class Post(PostCreate):
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

users_db: list[User] = []
posts_db: list[Post] = []
next_user_id = 1
next_post_id = 1


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/users")
def create_user(payload: UserCreate) -> User:
    global next_user_id
    user = User(id=next_user_id, **payload.model_dump())
    users_db.append(user)
    next_user_id += 1
    return user


@app.post("/posts")
def create_post(payload: PostCreate) -> Post:
    global next_post_id
    post = Post(id=next_post_id, **payload.model_dump())
    posts_db.append(post)
    next_post_id += 1
    return post


@app.get("/posts")
def list_posts(_limit: Optional[int] = Query(default=None, ge=1)) -> list[Post]:
    if _limit is None:
        return posts_db
    return posts_db[:_limit]
