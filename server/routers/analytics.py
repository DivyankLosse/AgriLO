from fastapi import APIRouter, Depends
from dependencies import get_current_user
import models
from collections import Counter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, col, func
from database import get_session
from services.soil_service import soil_service
from schemas.soil import SoilDataInput

router = APIRouter()

@router.get("/summary")
async def get_analytics_summary(
    current_user: models.User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # 1. Soil Trends (Priority: Hardware Sensors, Fallback: Manual Scans)
    # Fetch latest 20 valid hardware sensor records
    stmt_hw = select(models.SoilData).where(
        (col(models.SoilData.nitrogen) > 0) | (col(models.SoilData.phosphorus) > 0) | (col(models.SoilData.potassium) > 0)
    ).order_by(models.SoilData.timestamp.desc()).limit(20)
    result_hw = await session.execute(stmt_hw)
    hw_data = result_hw.scalars().all()

    soil_trends = []
    current_problems = []
    soil_status = "Excellent"
    
    if hw_data:
        # Get latest for problem detection
        latest_record = hw_data[0]
        soil_status, _, current_problems = soil_service.analyze_health(SoilDataInput(
            nitrogen=latest_record.nitrogen,
            phosphorus=latest_record.phosphorus,
            potassium=latest_record.potassium,
            ph=latest_record.ph,
            moisture=latest_record.moisture,
            temperature=latest_record.temperature,
            rainfall=100 # Default/Mock
        ))

        # Use hardware data for trends
        for record in reversed(hw_data):
            soil_trends.append({
                "date": record.timestamp.isoformat(),
                "nitrogen": record.nitrogen,
                "phosphorus": record.phosphorus,
                "potassium": record.potassium,
                "ph": record.ph
            })
    else:
        # Fallback to manual scans if no hardware data
        stmt_soil = select(models.Scan).where(
            models.Scan.user_id == current_user.id,
            models.Scan.scan_type == "soil"
        ).order_by(models.Scan.created_at.desc()).limit(7)
        
        result_soil = await session.execute(stmt_soil)
        recent_soil_scans = result_soil.scalars().all()
        
        for scan in reversed(recent_soil_scans):
            stmt_res = select(models.AnalysisResult).where(models.AnalysisResult.scan_id == scan.id)
            result_res = await session.execute(stmt_res)
            result_obj = result_res.scalars().first()
            
            if result_obj and result_obj.result_data:
                data = result_obj.result_data
                soil_trends.append({
                    "date": scan.created_at.strftime("%Y-%m-%d"),
                    "nitrogen": data.get("nitrogen", 0),
                    "phosphorus": data.get("phosphorus", 0),
                    "potassium": data.get("potassium", 0),
                    "ph": data.get("ph", 0)
                })

    # 2. Disease Stats (Frequency from Leaf Scans)
    stmt_leaf = select(models.Scan).where(
        models.Scan.user_id == current_user.id,
        models.Scan.scan_type == "leaf"
    )
    result_leaf = await session.execute(stmt_leaf)
    leaf_scans = result_leaf.scalars().all()
    
    diseases = [s.disease_detected for s in leaf_scans if s.disease_detected]
    disease_counts = Counter(diseases)
    
    disease_stats = [{"name": name, "count": count} for name, count in disease_counts.items()]

    # 3. Recent Activity (Combine Soil and Disease)
    # Fetch recent mixed scans
    stmt_recent = select(models.Scan).where(
        models.Scan.user_id == current_user.id
    ).order_by(models.Scan.created_at.desc()).limit(10)
    
    result_recent = await session.execute(stmt_recent)
    recent_scans = result_recent.scalars().all()
    
    activity = []
    for s in recent_scans:
        if s.scan_type == "soil":
             activity.append({
                "type": "soil",
                "date": s.created_at,
                "crop": s.crop_name or "Unknown",
                "result": "Analyzed", 
                "confidence": "-",
                "status": "Info",
                "image": s.image_url
            })
        elif s.scan_type == "leaf":
            status = "Warning"
            if s.disease_detected and "healthy" in s.disease_detected.lower():
                status = "Info"
            
            activity.append({
                "type": "disease",
                "date": s.created_at,
                "crop": "Unknown",
                "result": s.disease_detected,
                "confidence": f"{int(s.confidence)}%" if s.confidence else "-",
                "status": status,
                "image": s.image_url
            })
        elif s.scan_type == "root":
             activity.append({
                "type": "disease",
                "date": s.created_at,
                "crop": "Root",
                "result": s.disease_detected,
                "confidence": "-",
                "status": "Warning" if s.disease_detected else "Info",
                "image": s.image_url
            })
    
    return {
        "soil_trends": soil_trends,
        "soil_status": soil_status,
        "soil_problems": current_problems,
        "disease_stats": disease_stats,
        "recent_activity": activity
    }
