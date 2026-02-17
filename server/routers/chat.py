from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional

from services.chat_service import chat_service
from dependencies import get_current_user
import models
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, col
from database import get_session

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    language: str = "en"

class ChatResponse(BaseModel):
    reply: str
    language: str

@router.post("/message", response_model=ChatResponse)
async def chat_message(
    request: ChatRequest,
    current_user: models.User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # 1. Get Response from AI
    reply = await chat_service.get_response(request.message, language=request.language)
    
    # 2. Save User Message
    user_msg = models.ChatHistory(
        user_id=current_user.id,
        role="user",
        message=request.message
    )
    session.add(user_msg)
    
    # 3. Save Bot Response
    bot_msg = models.ChatHistory(
        user_id=current_user.id,
        role="bot",
        message=reply
    )
    session.add(bot_msg)
    
    await session.commit()
    
    return {
        "reply": reply,
        "language": request.language
    }

@router.get("/history")
async def get_chat_history(
    current_user: models.User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    statement = select(models.ChatHistory).where(
        models.ChatHistory.user_id == current_user.id
    ).order_by(models.ChatHistory.created_at.asc())
    
    result = await session.execute(statement)
    history = result.scalars().all()
    return history
