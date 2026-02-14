from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional
from datetime import datetime, timedelta
import uuid

import models
from schemas import auth as schemas
from utils import auth as utils
from config import settings
from dependencies import get_current_active_user

router = APIRouter()

async def create_auth_session(user_id: str, ip_address: str = None, device_info: str = None):
    refresh_token = utils.create_refresh_token(subject=user_id)
    expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    new_session = models.AuthSession(
        user_id=user_id,
        refresh_token=refresh_token,
        ip_address=ip_address,
        device_info=device_info,
        expires_at=expires_at
    )
    await new_session.insert()
    return refresh_token

@router.post("/register", response_model=schemas.Token)
async def register(
    user: schemas.UserCreate, 
    response: Response, 
    request: Request
):
    # Check email
    email = user.email.lower().strip()
    existing_email = await models.User.find_one(models.User.email == email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check phone
    phone_val = user.phone
    if phone_val and not phone_val.strip():
        phone_val = None
    elif phone_val:
        existing_phone = await models.User.find_one(models.User.phone == phone_val)
        if existing_phone:
            raise HTTPException(status_code=400, detail="Phone number already registered")

    hashed_password = utils.get_password_hash(user.password)
    new_user = models.User(
        email=email,
        hashed_password=hashed_password,
        name=user.name,
        phone=phone_val,
        language=user.language or "en",
        role=user.role if user.role else models.UserRole.FARMER.value,
        location=user.location
    )
    try:
        await new_user.insert()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
        
    # Auto-login: Create access token & session
    access_token = utils.create_access_token(subject=new_user.email)
    
    # Create Refresh Token Session
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent")
    refresh_token = await create_auth_session(new_user.id, client_ip, user_agent)
    
    # Set Refresh Token Cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False, # Set to True in HTTPS
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "role": new_user.role,
        "language": new_user.language
    }

@router.post("/login", response_model=schemas.Token)
async def login(
    response: Response, 
    request: Request, 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    email = form_data.username.lower().strip()
    user = await models.User.find_one(models.User.email == email)
    
    if not user or not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = utils.create_access_token(subject=user.email)
    
    # Create Refresh Token Session
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent")
    refresh_token = await create_auth_session(user.id, client_ip, user_agent)
    
    # Set Refresh Token Cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False, # Set to True in HTTPS
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "language": user.language
    }

@router.post("/refresh", response_model=schemas.Token)
async def refresh_token(
    response: Response, 
    request: Request, 
    refresh_token: Optional[str] = Cookie(None)
):
    if not refresh_token:
         raise HTTPException(status_code=401, detail="Refresh token missing")
    
    # Find session
    auth_session = await models.AuthSession.find_one(models.AuthSession.refresh_token == refresh_token)
    
    if not auth_session:
        response.delete_cookie("refresh_token")
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    # Check expiry
    if auth_session.expires_at.replace(tzinfo=None) < datetime.utcnow():
        await auth_session.delete()
        response.delete_cookie("refresh_token")
        raise HTTPException(status_code=401, detail="Refresh token expired")
        
    # Retrieve user manually
    user = await models.User.get(auth_session.user_id)
    
    if not user:
         raise HTTPException(status_code=401, detail="User not found")

    # Generate new access token
    access_token = utils.create_access_token(subject=user.email)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "language": user.language
    }

@router.post("/logout")
async def logout(
    response: Response, 
    refresh_token: Optional[str] = Cookie(None)
):
    if refresh_token:
        auth_session = await models.AuthSession.find_one(models.AuthSession.refresh_token == refresh_token)
        if auth_session:
            await auth_session.delete()
    
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user
