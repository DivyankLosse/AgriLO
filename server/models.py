from sqlmodel import SQLModel, Field
from sqlalchemy import JSON, Column
from typing import Optional, Dict, Any
from datetime import datetime
import uuid
import enum

# Define Enums
class UserRole(str, enum.Enum):
    FARMER = "farmer"
    EXPERT = "expert"
    ADMIN = "admin"

class QueryStatus(str, enum.Enum):
    OPEN = "open"
    ANSWERED = "answered"
    CLOSED = "closed"

class AppointmentStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str = Field(max_length=100)
    email: str = Field(unique=True, index=True)
    phone: Optional[str] = Field(default=None, max_length=15)
    hashed_password: str
    role: str = Field(default=UserRole.FARMER.value)
    language: str = Field(default="en")
    location: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    settings: Optional[Dict[str, Any]] = Field(default={}, sa_column=Column(JSON))
    is_verified: bool = Field(default=False)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)

class AuthSession(SQLModel, table=True):
    __tablename__ = "auth_sessions"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    refresh_token: str
    device_info: Optional[str] = None
    ip_address: Optional[str] = None
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Scan(SQLModel, table=True):
    __tablename__ = "scans"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    scan_type: str # leaf, soil, root
    crop_name: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Generic status/summary fields
    disease_detected: Optional[str] = None
    confidence: Optional[float] = None

class AnalysisResult(SQLModel, table=True):
    __tablename__ = "analysis_results"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    scan_id: str = Field(index=True)
    
    result_data: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ExpertQuery(SQLModel, table=True):
    __tablename__ = "expert_queries"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    expert_id: Optional[str] = Field(default=None, index=True)
    scan_id: Optional[str] = None
    
    question: str
    answer: Optional[str] = None
    status: str = Field(default=QueryStatus.OPEN.value)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

class ChatHistory(SQLModel, table=True):
    __tablename__ = "chat_history"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    role: str # "user" or "bot"
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SupportTicket(SQLModel, table=True):
    __tablename__ = "support_tickets"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    subject: str
    message: str
    status: str = Field(default="Open")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SoilData(SQLModel, table=True):
    __tablename__ = "soil_data"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    node_id: str
    nitrogen: int
    phosphorus: int
    potassium: int
    ph: float
    moisture: float
    temperature: float
    ec: float

class Appointment(SQLModel, table=True):
    __tablename__ = "appointments"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    name: str # Contact name
    phone: str
    date: datetime
    address: str
    amount: float = 199.00
    payment_id: Optional[str] = None
    order_id: Optional[str] = None
    status: str = Field(default=AppointmentStatus.PENDING.value)
    created_at: datetime = Field(default_factory=datetime.utcnow)
