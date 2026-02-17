from fastapi import APIRouter, Depends
from pydantic import BaseModel
from dependencies import get_current_user
import models
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_session

router = APIRouter()

class TicketRequest(BaseModel):
    subject: str
    message: str

@router.post("/ticket")
async def create_ticket(
    ticket: TicketRequest,
    current_user: models.User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # Save to DB
    new_ticket = models.SupportTicket(
        user_id=current_user.id,
        subject=ticket.subject,
        message=ticket.message
    )
    session.add(new_ticket)
    await session.commit()
    await session.refresh(new_ticket)
    
    return {"status": "success", "message": "Ticket submitted successfully", "ticket_id": new_ticket.id}
