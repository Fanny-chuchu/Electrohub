from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

# =========================================
# JWT CONFIG
# =========================================

SECRET_KEY = "electrohub_secret_key"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_DAYS = 1


# =========================================
# PASSWORD HASHING
# =========================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================================
# HASH PASSWORD
# =========================================

def hash_password(password: str):

    # FIX BCRYPT LIMIT
    safe_password = password[:72]

    return pwd_context.hash(
        safe_password
    )


# =========================================
# VERIFY PASSWORD
# =========================================

def verify_password(
    plain_password,
    hashed_password
):

    # FIX BCRYPT LIMIT
    safe_password = plain_password[:72]

    return pwd_context.verify(
        safe_password,
        hashed_password
    )


# =========================================
# CREATE JWT TOKEN
# =========================================

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = (
        datetime.utcnow()
        + timedelta(
            days=ACCESS_TOKEN_EXPIRE_DAYS
        )
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# =========================================
# DECODE TOKEN
# =========================================

def decode_token(token: str):

    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )