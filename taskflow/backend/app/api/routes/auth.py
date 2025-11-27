# backend/app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from app.db import get_session
from app.services.user_service import UserService
from app.schemas.schemas import UserCreate, Token
from app.schemas.schemas import UserLogin

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
async def signup(payload: UserCreate, session: AsyncSession = Depends(get_session)):
    import random
    import string
    
    svc = UserService(session)
    existing = await svc.repo.get_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Auto-generate 6 character alphanumeric code_id
    code_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    
    # Ensure uniqueness
    while await svc.get_by_code(code_id):
        code_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    
    user = await svc.create_user(payload.name, payload.email, payload.password, code_id)
    return {"message": "user created", "user_id": user.id, "code_id": code_id}

@router.post("/login", response_model=Token)
async def login(payload: UserLogin, session: AsyncSession = Depends(get_session)):
    svc = UserService(session)
    user = await svc.authenticate(payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(user.id), "exp": expire}
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

# helper to decode token inside routes
def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except Exception:
        return None

async def get_user_id_from_header(authorization: str | None = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    uid = decode_token(token)
    if uid is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return uid

@router.get("/profile")
async def get_profile(session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = UserService(session)
    user = await svc.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "code_id": user.code_id,
        "profile_picture": user.profile_picture,
        "created_at": user.created_at
    }

@router.patch("/profile")
async def update_profile(payload: dict, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = UserService(session)
    user = await svc.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if "name" in payload:
        user.name = payload["name"]
    if "email" in payload:
        # Check if email is already taken
        existing = await svc.repo.get_by_email(payload["email"])
        if existing and existing.id != user_id:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = payload["email"]
    if "profile_picture" in payload:
        user.profile_picture = payload["profile_picture"]
    
    updated = await svc.repo.update(user)
    return {"message": "Profile updated", "user": {"id": updated.id, "name": updated.name, "email": updated.email, "profile_picture": updated.profile_picture}}

@router.patch("/password")
async def update_password(payload: dict, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = UserService(session)
    user = await svc.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if "current_password" not in payload or "new_password" not in payload:
        raise HTTPException(status_code=400, detail="current_password and new_password required")
    
    # Verify current password
    if user.password != payload["current_password"]:
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    
    # Update to new password
    user.password = payload["new_password"]
    await svc.repo.update(user)
    
    return {"message": "Password updated successfully"}

@router.get("/user/{user_id}")
async def get_public_profile(user_id: int, session: AsyncSession = Depends(get_session)):
    """
    Public endpoint to view user profile by ID
    Used for viewing team member profiles and verification before inviting
    """
    svc = UserService(session)
    user = await svc.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return only public information
    return {
        "id": user.id,
        "name": user.name,
        "code_id": user.code_id,
        "profile_picture": user.profile_picture,
        "created_at": user.created_at
    }
