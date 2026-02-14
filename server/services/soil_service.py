import os
import joblib
import numpy as np
from config import settings
from schemas import soil as schemas

class SoilService:
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

    def analyze_health(self, data: schemas.SoilDataInput):
        # Determine health based on nutrient levels (simple heuristic for MVP)
        # Ideal NPK approx: N(50-200), P(20-100), K(50-200), pH(6-7.5)
        
        score = 0
        total_checks = 4
        
        # pH Check
        if 6.0 <= data.ph <= 7.5:
            score += 1
        
        # Nitrogen Check (broad range)
        if 50 <= data.nitrogen <= 200:
            score += 1
            
        # Phosphorus Check
        if 20 <= data.phosphorus <= 100:
            score += 1
            
        # Potassium Check
        if 50 <= data.potassium <= 200:
            score += 1
            
        health_percentage = (score / total_checks) * 100
        
        if health_percentage >= 75:
            status = "Good"
        elif health_percentage >= 50:
            status = "Average"
        else:
            status = "Poor"
            
        return status, health_percentage

    def predict_crop(self, data: schemas.SoilDataInput):
        if not self.model:
            return "Model unavailable"
            
        try:
            # Features: N, P, K, temp, humidity, ph, rainfall
            # Mocking humidity as we don't have it in input yet, defaulting to 80 or similar
            humidity = 70.0 
            
            features = np.array([[
                data.nitrogen,
                data.phosphorus,
                data.potassium,
                data.temperature,
                humidity,
                data.ph,
                data.rainfall
            ]])
            
            prediction_idx = self.model.predict(features)[0]
            crop_name = self.label_encoder.inverse_transform([prediction_idx])[0]
            return crop_name
        except Exception as e:
            print(f"Prediction logic error: {e}")
            return "Analysis failed"

    def get_recommendations(self, status: str, crop: str):
        if status == "Good":
            return [f"Soil is suitable for {crop}.", "Maintain current irrigation schedule."]
        elif status == "Average":
            return [f"Soil needs slight nutrient boost for {crop}.", "Consider adding organic compost.", "Check Ph levels."]
        else:
            return ["Soil quality is poor.", "Do not plant yet.", "Add NPK fertilizers 10:10:10.", "Consult soil expert."]

soil_service = SoilService()
