from fastapi import APIRouter, HTTPException, Depends
from models import SoilData
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, col
from database import get_session

router = APIRouter()

@router.get("/latest", response_model=SoilData)
async def get_latest_soil_data(session: AsyncSession = Depends(get_session)):
    # Filter for non-zero NPK to avoid showing sensor errors
    statement = select(SoilData).where(
        (col(SoilData.nitrogen) > 0) | (col(SoilData.phosphorus) > 0) | (col(SoilData.potassium) > 0)
    ).order_by(SoilData.timestamp.desc()).limit(1)
    
    result = await session.execute(statement)
    result_obj = result.scalars().first()
    
    if result_obj:
        print(f"[DEBUG] Fetching latest soil data: {result_obj.nitrogen}, {result_obj.phosphorus}, {result_obj.potassium}")
    else:
        print("[DEBUG] No soil data found in DB")
    
    if not result_obj:
        raise HTTPException(status_code=404, detail="No sensor data found")
    
    return result_obj

@router.get("/history", response_model=List[SoilData])
async def get_soil_history(
    limit: int = 10,
    session: AsyncSession = Depends(get_session)
):
    statement = select(SoilData).order_by(SoilData.timestamp.desc()).limit(limit)
    result = await session.execute(statement)
    return result.scalars().all()
