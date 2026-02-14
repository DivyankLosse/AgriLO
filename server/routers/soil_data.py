from fastapi import APIRouter, HTTPException
from models import SoilData
from typing import List

router = APIRouter()

@router.get("/latest", response_model=SoilData)
async def get_latest_soil_data():
    result = await SoilData.find_all().sort("-timestamp").first_or_none()
    
    if not result:
        raise HTTPException(status_code=404, detail="No sensor data found")
    
    return result

@router.get("/history", response_model=List[SoilData])
async def get_soil_history(limit: int = 10):
    return await SoilData.find_all().sort("-timestamp").limit(limit).to_list()
