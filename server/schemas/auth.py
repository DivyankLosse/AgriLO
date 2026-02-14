from pydantic import BaseModel, EmailStr
from typing import Optional, Union
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    FARMER = "farmer"
    EXPERT = "expert"
    ADMIN = "admin"

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    phone: Optional[str] = None
    language: Optional[str] = "en"

class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.FARMER
    location: Optional[dict] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    name: str
    email: str
    role: str
    language: str

class TokenData(BaseModel):
    email: Union[str, None] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    language: Optional[str] = None
    password: Optional[str] = None
    location: Optional[dict] = None
    role: Optional[UserRole] = None
    settings: Optional[dict] = None

class UserResponse(UserBase):
    id: str
    role: str
    settings: Optional[dict] = {}
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True
