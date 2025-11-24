# backend/app/api/deps.py
from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status, Header
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_session
from app.repositories.user_repo import UserRepo
from app.core.config import SECRET_KEY, ALGORITHM

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async for s in get_session():
        yield s

async def get_current_user(
    authorization: str = Header(None),
    session: AsyncSession = Depends(get_db)
):
    """
    Extract and validate JWT token from Authorization header
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        # Extract token from "Bearer <token>"
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
        
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Get user from database
        user_repo = UserRepo(session)
        user = await user_repo.get_by_id(int(user_id))
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return user
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
