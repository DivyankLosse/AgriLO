import os
import io
import json
import numpy as np
import asyncio
from PIL import Image
import tensorflow as tf
import keras
from config import settings
from services.treatment_service import treatment_service

class DiseaseService:
    def __init__(self):
        self.model = None
        self.class_indices = {}
        # Model is NOT loaded here to allow fast startup

    def _load_model(self):
        if self.model is not None:
             return

        try:
            import tensorflow_model_optimization as tfmot
            print("[INFO] Loading Leaf Disease Model (Lazy Load)...")
            # Load Model
            if os.path.exists(settings.LEAF_MODEL_PATH):
                with tfmot.quantization.keras.quantize_scope():
                    self.model = keras.models.load_model(settings.LEAF_MODEL_PATH)
                print("[INFO] Leaf Disease Model (TensorFlow) Loaded")
            else:
                 print(f"[WARN] Leaf Model not found at {settings.LEAF_MODEL_PATH}")

            # Load Class Indices
            if os.path.exists(settings.CLASS_INDICES_PATH):
                with open(settings.CLASS_INDICES_PATH, 'r') as f:
                    self.class_indices = json.load(f)
                    # Invert dictionary to map index -> class name
                    self.class_indices = {v: k for k, v in self.class_indices.items()}
                print("[INFO] Class indices loaded")
            else:
                print(f"[WARN] Class indices not found at {settings.CLASS_INDICES_PATH}")

        except Exception as e:
            print(f"[ERROR] Error loading leaf model: {e}")

    async def predict_disease(self, image_data: bytes):
        # Lazy Load
        if not self.model:
            self._load_model()
            if not self.model:
                return None, 0, {"error": "Model not loaded service unavailable"}
        
        try:
            # Preprocess Image
            img = Image.open(io.BytesIO(image_data)).convert('RGB')
            img = img.resize((256, 256))
            img_array = np.array(img)
            img_array = np.expand_dims(img_array, axis=0) # Add batch dimension
            img_array = img_array / 255.0 # Rescale

            # Predict (Wrap in thread pool to prevent blocking event loop)
            predictions = await asyncio.to_thread(self.model.predict, img_array)
            
            # Get Top-3 predictions for transparency
            top_3_indices = np.argsort(predictions[0])[-3:][::-1]
            print(f"\n[AI DEBUG] Top-3 Predictions:")
            for i, idx in enumerate(top_3_indices):
                label = self.class_indices.get(idx, "Unknown")
                conf = float(predictions[0][idx]) * 100
                print(f"  {i+1}. {label}: {conf:.2f}%")
            
            pred_idx = top_3_indices[0]
            confidence = float(predictions[0][pred_idx]) * 100
            
            # Confidence Threshold (Increased to 70% for production reliability)
            CONFIDENCE_THRESHOLD = 70.0
            
            if confidence < CONFIDENCE_THRESHOLD:
                disease_name = "Unknown"
                print(f"[INFO] Low confidence: {confidence:.2f}% (Falling back to Unknown)")
            else:
                disease_name = self.class_indices.get(pred_idx, "Unknown")
                
            # Special check for "Healthy": if any of top 3 are healthy and within 10% of top, prioritize healthy
            # This helps with the "green leaf" issue the user mentioned
            for idx in top_3_indices:
                label = self.class_indices.get(idx, "Unknown")
                conf = float(predictions[0][idx]) * 100
                if "healthy" in label.lower() and (confidence - conf) < 15.0:
                    print(f"[AI INFO] High potential for healthy leaf ({label}: {conf:.2f}%). Prioritizing healthy status.")
                    disease_name = label
                    confidence = conf
                    break

            # Get Treatment
            treatment_info = treatment_service.get_treatment(disease_name)
            
            return disease_name, confidence, treatment_info
            
        except Exception as e:
            print(f"Prediction Error: {e}")
            return None, 0, {"error": str(e)}

disease_service = DiseaseService()
