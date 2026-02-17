from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List, Optional
from pydantic import BaseModel
import os
import uuid

import models
from dependencies import get_current_user
from services.root_service import root_service
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_session

router = APIRouter()

class RootResponse(BaseModel):
    status: str
    diagnosis: str
    recommendation: str

@router.post("/analyze", response_model=RootResponse)
async def analyze_root(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    contents = await file.read()
    
     # Save image
    filename = f"{uuid.uuid4()}.jpg"
    file_path = f"static/uploads/{filename}"
    os.makedirs("static/uploads", exist_ok=True)
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    image_url = f"http://localhost:5000/{file_path}"
    
    diagnosis, recommendation = await root_service.predict_root_disease(contents)

    # Save to DB (Scan)
    try:
        new_scan = models.Scan(
            user_id=current_user.id,
            scan_type="root",
            image_url=image_url,
            disease_detected=diagnosis,
            confidence=100.0 if diagnosis else 0.0 # Heuristic
        )
        session.add(new_scan)
        await session.commit()
        await session.refresh(new_scan)
        
        # Save Result Details
        new_result = models.AnalysisResult(
            scan_id=new_scan.id,
            result_data={
                "diagnosis": diagnosis,
                "recommendation": recommendation,
                "symptoms": []
            }
        )
        session.add(new_result)
        await session.commit()
    except Exception as e:
        print(f"DB Error: {e}")

    return {
        "status": "success",
        "diagnosis": diagnosis,
        "recommendation": recommendation
    }
