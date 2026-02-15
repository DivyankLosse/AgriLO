import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import os
import tensorflow_model_optimization as tfmot
from config import settings

class RootService:
    def __init__(self):
        self.model = None
        self.class_labels = {}
        # Model is NOT loaded here to allow fast startup

    def _load_model(self):
        if self.model is not None:
             return
             
        try:
            print("[INFO] Loading Root Disease Model (Lazy Load)...")
            if os.path.exists(settings.ROOT_MODEL_PATH):
                with tfmot.quantization.keras.quantize_scope():
                    self.model = tf.keras.models.load_model(settings.ROOT_MODEL_PATH)
                print("[INFO] Root Disease Model Loaded")
            else:
                print(f"[WARN] Root Model not found at {settings.ROOT_MODEL_PATH}")

            if os.path.exists(settings.ROOT_CLASS_INDICES_PATH):
                with open(settings.ROOT_CLASS_INDICES_PATH, 'r') as f:
                    class_indices = json.load(f)
                # Invert mapping: index -> label
                self.class_labels = {v: k for k, v in class_indices.items()}
            else:
                 print(f"[WARN] Root Class Indices not found at {settings.ROOT_CLASS_INDICES_PATH}")

        except Exception as e:
            print(f"[ERROR] Error loading root model: {e}")

    async def predict_root_disease(self, image_data: bytes):
        # Lazy Load
        if not self.model:
             self._load_model()
             if not self.model:
                 return "Model unavailable", "Please contact support."

        try:
            # Preprocess Image
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            image = image.resize((224, 224))
            img_array = np.array(image) / 255.0
            img_array = np.expand_dims(img_array, axis=0)

            # Predict
            predictions = self.model.predict(img_array)
            predicted_idx = np.argmax(predictions[0])
            confidence = float(np.max(predictions[0])) * 100
            diagnosis = self.class_labels.get(predicted_idx, "Unknown")

            # Simple Recommendations based on diagnosis
            recommendation = self.get_recommendation(diagnosis)
            
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
