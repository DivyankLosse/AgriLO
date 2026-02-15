import os
import io
import json
import numpy as np
from PIL import Image
import tensorflow as tf
import tensorflow_model_optimization as tfmot
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
            print("[INFO] Loading Leaf Disease Model (Lazy Load)...")
            # Load Model
            if os.path.exists(settings.LEAF_MODEL_PATH):
                with tfmot.quantization.keras.quantize_scope():
                    self.model = tf.keras.models.load_model(settings.LEAF_MODEL_PATH)
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
            img = img.resize((224, 224))
            img_array = np.array(img)
            img_array = np.expand_dims(img_array, axis=0) # Add batch dimension
            img_array = img_array / 255.0 # Rescale

            # Predict
            predictions = self.model.predict(img_array)
            pred_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][pred_idx]) * 100
            
            # Confidence Threshold
            CONFIDENCE_THRESHOLD = 40.0
            
            if confidence < CONFIDENCE_THRESHOLD:
                disease_name = "Unknown"
                print(f"[INFO] Low confidence: {confidence:.2f}%")
            else:
                disease_name = self.class_indices.get(pred_idx, "Unknown")
                
            # Get Treatment
            treatment_info = treatment_service.get_treatment(disease_name)
            
            return disease_name, confidence, treatment_info
            
        except Exception as e:
            print(f"Prediction Error: {e}")
            return None, 0, {"error": str(e)}

disease_service = DiseaseService()
