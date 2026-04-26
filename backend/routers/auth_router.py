import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from psycopg2.extras import RealDictCursor

from database.db_connection import get_connection

router = APIRouter()

SECRET_KEY = os.getenv("AUTH_SECRET_KEY", "change_me_to_a_long_random_secret")
ALGORITHM = "HS256"


class RegisterPayload(BaseModel):
    full_name: str
    phone_number: str
    email: str
    password: str
    confirm_password: str


class LoginPayload(BaseModel):
    email: str
    password: str


def _connection_or_500():
    connection = get_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    return connection


def _create_token(user_id: int, email: str):
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def _decode_token(authorization: str | None):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(status_code=401, detail="Token expired") from exc
    except jwt.InvalidTokenError as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc


@router.post("/register")
def register_user(payload: RegisterPayload):
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    if len(payload.phone_number) != 10 or not payload.phone_number.isdigit():
        raise HTTPException(status_code=400, detail="Invalid phone number")

    connection = _connection_or_500()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        password_hash = bcrypt.hashpw(payload.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        cursor.execute(
            """
            INSERT INTO users (full_name, phone_number, email, password_hash)
            VALUES (%s, %s, %s, %s)
            RETURNING id, full_name, phone_number, email, is_active
            """,
            (payload.full_name, payload.phone_number, payload.email, password_hash),
        )
        created_user = cursor.fetchone()
        connection.commit()
        token = _create_token(created_user["id"], created_user["email"])
        return {
            "message": "User registered successfully",
            "token": token,
            "user": created_user,
        }
    except Exception as exc:
        connection.rollback()
        error = str(exc).lower()
        if "users_email_key" in error or "users_phone_number_key" in error or "duplicate key" in error:
            raise HTTPException(status_code=400, detail="Email or phone number already exists") from exc
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        cursor.close()
        connection.close()


@router.post("/login")
def login_user(payload: LoginPayload):
    connection = _connection_or_500()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            """
            SELECT id, full_name, phone_number, email, password_hash, is_active
            FROM users
            WHERE email = %s
            """,
            (payload.email,),
        )
        user = cursor.fetchone()
        if user is None:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if not user["is_active"]:
            raise HTTPException(status_code=403, detail="Account is inactive")

        if not bcrypt.checkpw(payload.password.encode("utf-8"), user["password_hash"].encode("utf-8")):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = _create_token(user["id"], user["email"])
        return {
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user["id"],
                "full_name": user["full_name"],
                "phone_number": user["phone_number"],
                "email": user["email"],
                "is_active": user["is_active"],
            },
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        cursor.close()
        connection.close()


@router.get("/me")
def get_current_user(authorization: str | None = Header(default=None)):
    payload = _decode_token(authorization)
    connection = _connection_or_500()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            """
            SELECT id, full_name, phone_number, email, is_active
            FROM users
            WHERE id = %s
            """,
            (payload["user_id"],),
        )
        user = cursor.fetchone()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        cursor.close()
        connection.close()
