from fastapi import APIRouter, Depends, UploadFile, File, Request
from pydantic import BaseModel
import asyncio
from typing import List, Optional
import os
import joblib
import uuid

import models
from schemas import soil as soil_schemas
from services.soil_service import soil_service
from services.disease_service import disease_service
from dependencies import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, col
from database import get_session
from utils.limiter import limiter

router = APIRouter()

# --- Response Models ---
class DiseaseResponse(BaseModel):
    status: str
    data: dict

@router.post("/soil/analyze", response_model=soil_schemas.SoilResponse)
@limiter.limit("10/minute")
async def analyze_soil(
    request: Request,
    data: soil_schemas.SoilDataInput,
    current_user: models.User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # 1. Analyze Health & Problems
    status, health_score, problems = soil_service.analyze_health(data)
    
    # 2. Save to DB (Scan + AnalysisResult)
    try:
        # Create Scan
        new_scan = models.Scan(
            user_id=current_user.id,
            scan_type="soil",
            crop_name="N/A",
            confidence=health_score, 
            disease_detected=status
        )
        session.add(new_scan)
        await session.commit()
        await session.refresh(new_scan)
        
        # Create AnalysisResult
        result_data = {
            "nitrogen": data.nitrogen,
            "phosphorus": data.phosphorus,
            "potassium": data.potassium,
            "ph": data.ph,
            "moisture": data.moisture,
            "temperature": data.temperature,
            "rainfall": data.rainfall,
            "problems": problems,
            "health_score": health_score
        }
        
        new_result = models.AnalysisResult(
            scan_id=new_scan.id,
            result_data=result_data
        )
        session.add(new_result)
        await session.commit()
        
    except Exception as e:
        print(f"DB Error: {e}")
        # Continue even if DB fails

    return {
        "status": "success",
        "data": {
            "health_status": status,
            "health_score": health_score,
            "problems": problems,
            "input_data": data.dict()
        }
    }


@router.post("/detect", response_model=DiseaseResponse)
@limiter.limit("5/minute")
async def detect_disease(
    request: Request,
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # 1. Read and Save File
    contents = await file.read()
    
    # Save image
    filename = f"{uuid.uuid4()}.jpg"
    file_path = f"static/uploads/{filename}"
    # Ensure dir exists
    os.makedirs("static/uploads", exist_ok=True)
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    image_url = f"{request.base_url}static/uploads/{filename}"
    
    # 2. Predict
    disease_name, confidence, treatment_info = await disease_service.predict_disease(contents)
    
    if not disease_name:
         return {
            "status": "error",
            "data": {"disease": "Model error", "confidence": 0, "severity": "Unknown", "treatment": []}
        }

    # 3. Save to DB (Scan + AnalysisResult)
    try:
        new_scan = models.Scan(
            user_id=current_user.id,
            scan_type="leaf",
            crop_name="Unknown", # Model doesn't predict crop name unless we have multi-class
            image_url=image_url,
            disease_detected=disease_name,
            confidence=confidence
        )
        session.add(new_scan)
        await session.commit()
        await session.refresh(new_scan)
        
        new_result = models.AnalysisResult(
            scan_id=new_scan.id,
            result_data=treatment_info
        )
        session.add(new_result)
        await session.commit()
    except Exception as e:
        print(f"DB Error: {e}")

    return {
        "status": "success",
        "data": {
            "disease": disease_name,
            "confidence": round(confidence, 2),
            "severity": treatment_info.get('severity', 'Unknown'),
            "treatment": treatment_info,
            "report_id": new_scan.id if 'new_scan' in locals() else None,
            "image_url": image_url
        }
    }

@router.get("/history")
async def get_analysis_history(
    limit: int = 10,
    current_user: models.User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # Fetch Scans (Leaf, Soil, Root)
    statement = select(models.Scan).where(
        col(models.Scan.user_id) == current_user.id
    ).order_by(models.Scan.created_at.desc()).limit(limit)
    
    result = await session.execute(statement)
    scans = result.scalars().all()

    history = []
    
    for scan in scans:
        item = {
            "id": scan.id,
            "type": scan.scan_type.capitalize(),
            "date": scan.created_at,
            "image": scan.image_url,
            "confidence": scan.confidence,
        }
        
        # Populate specific fields based on type
        if scan.scan_type == "leaf":
            item["title"] = "Leaf Disease Detection"
            item["result"] = scan.disease_detected
            item["status"] = "Healthy" if "healthy" in (scan.disease_detected or "").lower() else "Issue Detected"
            item["image"] = scan.image_url or "https://source.unsplash.com/random/200x200?leaf"
            
            # Load extra data manually
            res_stmt = select(models.AnalysisResult).where(models.AnalysisResult.scan_id == scan.id)
            res_result = await session.execute(res_stmt)
            analysis_res = res_result.scalars().first()
            
            if analysis_res:
                res_data = analysis_res.result_data 
                
                item["severity"] = res_data.get("severity")
                item["treatment"] = res_data

        elif scan.scan_type == "soil":
            item["title"] = "Soil Health Check"
            item["result"] = f"Status: {scan.disease_detected}"
            item["status"] = scan.disease_detected
            item["image"] = "https://source.unsplash.com/random/200x200?soil"
            
        elif scan.scan_type == "root":
            item["title"] = "Root Health Check"
            item["result"] = scan.disease_detected # Diagnosis
            item["status"] = "Healthy" if "healthy" in (scan.disease_detected or "").lower() else "Issue Detected"
            item["image"] = scan.image_url or "https://source.unsplash.com/random/200x200?roots"
            
        history.append(item)
        
    return history

@router.get("/similar")
async def get_similar_cases(
    disease: str,
    limit: int = 5,
    session: AsyncSession = Depends(get_session)
):
    statement = select(models.Scan).where(
        models.Scan.disease_detected == disease,
        models.Scan.scan_type == "leaf"
    ).order_by(models.Scan.created_at.desc()).limit(limit)
    
    result = await session.execute(statement)
    scans = result.scalars().all()

    similar_cases = []
    for s in scans:
         similar_cases.append({
            "id": s.id,
            "disease": s.disease_detected,
            "location": "Nearby", # Mock location
            "image": s.image_url or "https://source.unsplash.com/random/200x200?farm",
            "date": s.created_at
        })
    
    return similar_cases
