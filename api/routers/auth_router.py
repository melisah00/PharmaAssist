from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Body, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession

from models.user_models import User
from repositories.user_repository import get_user_by_username
from sqlalchemy import update
from schemas.user import UserUpdate, PasswordUpdate
from schemas.user import PasswordUpdate, UserCreate, UserResponse, UserLogin, TokenResponse, UserUpdate
from repositories.user_repository import create_user, get_user_by_email
from services.auth import (
    get_password_hash,
    create_access_token,
    authenticate_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    verify_password
)
from database import get_db
from dependencies import get_current_user

router = APIRouter(tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if username or email exists
    existing_user = await get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    existing_email = await get_user_by_email(db, user.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_data = user.dict(exclude={"password"})
    user_data["hashed_password"] = hashed_password
    new_user = await create_user(db, user_data)
    return new_user

@router.post("/login", response_model=TokenResponse)
async def login_user(
    response: Response,
    user_data: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_user(db, user_data.username, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # Set cookie with token
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=True,  
        samesite="Lax"
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    update_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Check if email is being changed and if it's already taken
        if update_data.email and update_data.email != current_user.email:
            existing_user = await get_user_by_email(db, update_data.email)
            if existing_user:
                raise HTTPException(
                    status_code=400,
                    detail="Email already registered"
                )

        # Update password if provided
        if update_data.password_data:
            if not verify_password(update_data.password_data.old_password, current_user.hashed_password):
                raise HTTPException(
                    status_code=400,
                    detail="Current password is incorrect"
                )
            current_user.hashed_password = get_password_hash(update_data.password_data.new_password)

        # Update other fields
        update_dict = update_data.dict(exclude_unset=True, exclude={'password_data'})
        for field, value in update_dict.items():
            setattr(current_user, field, value)

        db.add(current_user)
        await db.commit()
        await db.refresh(current_user)
        
        return current_user

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating user: {str(e)}"
        )

