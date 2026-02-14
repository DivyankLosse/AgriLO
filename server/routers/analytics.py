from fastapi import APIRouter, Depends
from dependencies import get_current_user
import models
from collections import Counter

router = APIRouter()

@router.get("/summary")
async def get_analytics_summary(
    current_user: models.User = Depends(get_current_user),
):
    # 1. Soil Trends (Last 7 reports)
    recent_soil_scans = await models.Scan.find(
        models.Scan.user_id == current_user.id,
        models.Scan.scan_type == "soil"
    ).sort("-created_at").limit(7).to_list()
    
    soil_trends = []
    # Reverse to chronological order
    for scan in reversed(recent_soil_scans):
        # Fetch detailed result
        result_obj = await models.AnalysisResult.find_one(models.AnalysisResult.scan_id == scan.id)
        
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
    leaf_scans = await models.Scan.find(
        models.Scan.user_id == current_user.id,
        models.Scan.scan_type == "leaf"
    ).to_list()
    
    diseases = [s.disease_detected for s in leaf_scans if s.disease_detected]
    disease_counts = Counter(diseases)
    
    disease_stats = [{"name": name, "count": count} for name, count in disease_counts.items()]

    # 3. Recent Activity (Combine Soil and Disease)
    # Fetch recent mixed scans
    recent_scans = await models.Scan.find(
        models.Scan.user_id == current_user.id
    ).sort("-created_at").limit(10).to_list()
    
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
            # Need severity which is in AnalysisResult, but for summary listing maybe skip or fetch
            # To avoid N+1, we might just assume status based on disease name or heuristic
            # Or fetch quickly.
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
        "disease_stats": disease_stats,
        "recent_activity": activity
    }
