from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from services.fertilizer_service import fertilizer_service

router = APIRouter()

class FertilizerRequest(BaseModel):
    nitrogen: int
    phosphorus: int
    potassium: int
    ph: float
    moisture: float
    soil_type: str
    crop_type: str
    temperature: int
    humidity: int

@router.post("/predict")
async def predict_fertilizer(data: FertilizerRequest):
    try:
        result = fertilizer_service.predict_fertilizer(data.dict())
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
