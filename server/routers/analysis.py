from fastapi import APIRouter, Depends, UploadFile, File
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

router = APIRouter()

# --- Response Models ---
class DiseaseResponse(BaseModel):
    status: str
    data: dict

@router.post("/soil/analyze", response_model=soil_schemas.SoilResponse)
async def analyze_soil(
    data: soil_schemas.SoilDataInput,
    current_user: models.User = Depends(get_current_user),
):
    # 1. Analyze Health
    status, health_score = soil_service.analyze_health(data)
    
    # 2. Predict Best Crop
    recommended_crop = soil_service.predict_crop(data)
    
    # 3. Get Recommendations
    recommendations = soil_service.get_recommendations(status, recommended_crop)
    
    # 4. Save to DB (Scan + AnalysisResult)
    try:
        # Create Scan
        new_scan = models.Scan(
            user_id=current_user.id,
            scan_type="soil",
            crop_name=recommended_crop,
            confidence=health_score, 
            disease_detected=status # Using this field for status/score summary
        )
        await new_scan.insert()
        
        # Create AnalysisResult
        result_data = {
            "nitrogen": data.nitrogen,
            "phosphorus": data.phosphorus,
            "potassium": data.potassium,
            "ph": data.ph,
            "moisture": data.moisture,
            "temperature": data.temperature,
            "rainfall": data.rainfall,
            "recommendations": recommendations,
            "health_score": health_score
        }
        
        new_result = models.AnalysisResult(
            scan_id=new_scan.id,
            result_data=result_data
        )
        await new_result.insert()
        
    except Exception as e:
        print(f"DB Error: {e}")
        # Continue even if DB fails

    return {
        "status": "success",
        "data": {
            "health_status": status,
            "health_score": health_score,
            "recommended_crop": recommended_crop,
            "recommendations": recommendations,
            "input_data": data.dict()
        }
    }


@router.post("/detect", response_model=DiseaseResponse)
async def detect_disease(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
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
    
    image_url = f"http://localhost:5000/{file_path}"
    
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
        await new_scan.insert()
        
        new_result = models.AnalysisResult(
            scan_id=new_scan.id,
            result_data=treatment_info
        )
        await new_result.insert()
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
):
    # Fetch Scans (Leaf, Soil, Root)
    scans = await models.Scan.find(
        models.Scan.user_id == current_user.id
    ).sort("-created_at").limit(limit).to_list()

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
            analysis_res = await models.AnalysisResult.find_one(models.AnalysisResult.scan_id == scan.id)
            
            if analysis_res:
                res_data = analysis_res.result_data # Beanie handles dict mapping
                
                item["severity"] = res_data.get("severity")
                item["treatment"] = res_data

        elif scan.scan_type == "soil":
            item["title"] = "Soil Quality Analysis"
            item["result"] = f"Crop: {scan.crop_name}"
            item["status"] = scan.disease_detected # We stored status/score summary here
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
):
    scans = await models.Scan.find(
        models.Scan.disease_detected == disease,
        models.Scan.scan_type == "leaf"
    ).sort("-created_at").limit(limit).to_list()

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
