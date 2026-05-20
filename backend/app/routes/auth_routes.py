from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserLogin
)

from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token
)

# =========================
# ROUTER
# =========================

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)

security = HTTPBearer()

# =========================
# DATABASE
# =========================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================
# REGISTER
# =========================

@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    try:

        hashed_password = hash_password(
            user.password
        )

        role = (
            "admin"
            if db.query(User).count() == 0
            else "customer"
        )

        db_user = User(

            name=user.name,

            email=user.email,

            password=hashed_password,

            role=role
        )

        db.add(db_user)

        db.commit()

        db.refresh(db_user)

        return {

            "message":
            "User created successfully",

            "user": {

                "id": db_user.id,

                "name": db_user.name,

                "email": db_user.email,

                "role": db_user.role
            }
        }

    except Exception as e:

        print("REGISTER ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    # FIND USER
    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    # INVALID EMAIL
    if not db_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email"
        )

    # VERIFY PASSWORD
    valid_password = verify_password(
        user.password,
        db_user.password
    )

    if not valid_password:

        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    # CREATE JWT TOKEN
    token = create_access_token({

        "user_id": db_user.id,

        "role": db_user.role

    })

    return {

        "access_token": token,

        "token_type": "bearer",

        "user": {

            "id": db_user.id,

            "name": db_user.name,

            "email": db_user.email,

            "role": db_user.role
        }
    }


# =========================
# CURRENT USER
# =========================

@router.get("/me")
def get_current_user(

    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),

    db: Session = Depends(get_db)
):

    token = credentials.credentials

    # DECODE JWT
    payload = decode_token(token)

    # FIND USER
    user = db.query(User).filter(
        User.id == payload.get("user_id")
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return {

        "id": user.id,

        "name": user.name,

        "email": user.email,

        "role": user.role
    }