import random
from services.treatment_service import treatment_service

class DiseaseService:
    def __init__(self):
        print("[INFO] Lite Mode: Disease Service initialized with Mock Data")
        self.mock_diseases = [
            "Healthy Java Plum", "Healthy Tea", "Healthy Basil",
            "Rust (Coffee)", "Common Rust (Corn)", "Early Blight (Potato)",
            "Late Blight (Potato)", "Leaf Blight (Tomato)", "Powdery Mildew"
        ]

    async def predict_disease(self, image_data: bytes):
        try:
            # Simulate processing time
            # time.sleep(0.5) 
            
            # Mock Prediction
            disease_name = random.choice(self.mock_diseases)
            confidence = round(random.uniform(75.0, 99.9), 2)
            
            print(f"[INFO] Mock Prediction: {disease_name} ({confidence}%)")

            # Get Treatment (Real Logic)
            treatment_info = treatment_service.get_treatment(disease_name)
            
            return disease_name, confidence, treatment_info
            
        except Exception as e:
            print(f"Prediction Error: {e}")
            return None, 0, {"error": str(e)}

disease_service = DiseaseService()
