import os
import joblib
import numpy as np
from config import settings
from schemas import soil as schemas

class SoilService:
    # Crop specific requirements (pH_min, pH_max, N_min, P_min, K_min)
    CROP_THRESHOLDS = {
        "blueberry": {"ph": (4.5, 5.5), "n": 30, "p": 15, "k": 30},
        "potato": {"ph": (5.0, 6.5), "n": 60, "p": 25, "k": 80},
        "rice": {"ph": (5.5, 7.0), "n": 80, "p": 30, "k": 40},
        "tomato": {"ph": (6.0, 7.0), "n": 60, "p": 30, "k": 60},
        "generic": {"ph": (6.0, 7.5), "n": 50, "p": 20, "k": 50}
    }

    def __init__(self):
        self.model = None
        self.label_encoder = None
        self._load_models()

    def _load_models(self):
        try:
            if os.path.exists(settings.SOIL_MODEL_PATH):
                self.model = joblib.load(settings.SOIL_MODEL_PATH)
                self.label_encoder = joblib.load(settings.LABEL_ENCODER_PATH)
                print("[INFO] Soil Analysis Models Loaded")
            else:
                print(f"[WARN] Soil Model not found at {settings.SOIL_MODEL_PATH}")
        except Exception as e:
            print(f"[ERROR] Error loading soil models: {e}")

    def analyze_health(self, data: schemas.SoilDataInput, crop_name: str = "generic"):
        # Normalize crop name
        crop_key = crop_name.lower() if crop_name else "generic"
        thresholds = self.CROP_THRESHOLDS.get(crop_key, self.CROP_THRESHOLDS["generic"])
        
        problems = []
        
        # pH Check
        ph_min, ph_max = thresholds["ph"]
        if data.ph < ph_min:
            problems.append(f"Soil is too Acidic for {crop_key} (Target: {ph_min}-{ph_max})")
        elif data.ph > ph_max:
            problems.append(f"Soil is too Alkaline for {crop_key} (Target: {ph_min}-{ph_max})")
        
        # Nitrogen Check
        if data.nitrogen < thresholds["n"]:
            problems.append(f"Nitrogen Deficiency (Low N for {crop_key})")
        elif data.nitrogen > 250:
            problems.append("Nitrogen Toxicity (Critical High N)")
            
        # Phosphorus Check
        if data.phosphorus < thresholds["p"]:
            problems.append(f"Phosphorus Deficiency (Low P for {crop_key})")
            
        # Potassium Check
        if data.potassium < thresholds["k"]:
            problems.append(f"Potassium Deficiency (Low K for {crop_key})")

        # Moisture Check
        if data.moisture < 20:
            problems.append("Critical: Very Dry Soil")
        elif data.moisture > 85:
            problems.append("Critical: Soil is Waterlogged")
            
        health_percentage = 100 - (len(problems) * 15)
        health_percentage = max(0, min(100, health_percentage))
        
        if health_percentage >= 85:
            status = "Excellent"
        elif health_percentage >= 70:
            status = "Good"
        elif health_percentage >= 50:
            status = "Fair"
        else:
            status = "Critical"
            
        return status, health_percentage, problems

soil_service = SoilService()
