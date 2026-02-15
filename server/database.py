from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from config import settings
import models

import certifi

async def init_db():
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    # Beanie initialization
    try:
        db = client.get_default_database()
    except Exception:
        db = client["agrilo"]
        
    await init_beanie(
        database=db,
        document_models=[
            models.User,
            models.AuthSession,
            models.Scan,
            models.AnalysisResult,
            models.ExpertQuery,
            models.ChatHistory,
            models.SupportTicket,
            models.SoilData,
            models.Appointment  # Added new model
        ]
    )

