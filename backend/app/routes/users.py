from fastapi import APIRouter
from backend.database import SessionLocal
from backend.models import User
from backend.auth import hash_password

router = APIRouter()

@router.post("/register")
def register(email: str, password: str):
    db = SessionLocal()
    user = User(email=email, password=hash_password(password))
    db.add(user)
    db.commit()
    return {"message": "User created"}