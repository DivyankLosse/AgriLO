import random

class RootService:
    def __init__(self):
        print("[INFO] Lite Mode: Root Service initialized with Mock Data")
        self.mock_diagnoses = [
            "Healthy Root", 
            "Diseased Root",
            "Root Rot (Fungal/Bacterial)",
            "Root Knot Nematodes"
        ]

    async def predict_root_disease(self, image_data: bytes):
        try:
             # Simulation
            diagnosis = random.choice(self.mock_diagnoses)
            
            # Simple Recommendations based on diagnosis
            recommendation = self.get_recommendation(diagnosis)
            
            print(f"[INFO] Mock Root Prediction: {diagnosis}")
            
            return diagnosis, recommendation

        except Exception as e:
            print(f"Root Prediction Error: {e}")
            raise e

    def get_recommendation(self, diagnosis):
        # Basic recommendations mapping
        recommendations = {
            "Healthy Root": "The roots appear healthy. Maintain current watering and soil conditions.",
            "Diseased Root": "Signs of root disease detected. Check for root rot, ensure proper drainage, and considered applying a fungicide.",
        }
        return recommendations.get(diagnosis, "Consult an agricultural expert for detailed analysis.")

    def analyze_symptoms(self, symptoms: list):
        # Backward compatibility / Fallback
        symptoms_lower = [s.lower() for s in symptoms]
        diagnosis = "Healthy"
        recommendation = "Maintain regular care."
        
        if "rotten smell" in symptoms_lower or "black roots" in symptoms_lower:
            diagnosis = "Root Rot (Fungal/Bacterial)"
            recommendation = "Stop watering immediately. Remove infected parts."
        elif "knots on roots" in symptoms_lower:
             diagnosis = "Root Knot Nematodes"
             recommendation = "Solarize soil. Use nematicides."
             
        return diagnosis, recommendation

root_service = RootService()
