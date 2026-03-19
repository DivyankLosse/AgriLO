import os
import io
import json
import numpy as np
import asyncio
from PIL import Image
import tf_compat
import tensorflow as tf
from config import settings
from services.treatment_service import treatment_service
from utils.model_loader import load_model_with_compat
from utils.model_factory import build_leaf_model

class DiseaseService:
    def __init__(self):
        self.model = None
        self.class_indices = {}
        # Model is NOT loaded here to allow fast startup

    def _load_model(self):
        if self.model is not None:
             return

        try:
            print("[INFO] Loading Leaf Disease Model (TensorFlow 2.15.0)...")

            if os.path.exists(settings.CLASS_INDICES_PATH):
                with open(settings.CLASS_INDICES_PATH, 'r') as f:
                    data = json.load(f)
                    self.class_indices = {int(v): k for k, v in data.items()}
                print("[INFO] Class indices loaded")
            
            if os.path.exists(settings.LEAF_MODEL_PATH):
                try:
                    num_classes = len(self.class_indices) if self.class_indices else 38
                    self.model = build_leaf_model(num_classes)
                    self.model.load_weights(settings.LEAF_MODEL_PATH)
                    print("[INFO] Leaf Disease Model weights loaded via rebuilt architecture")
                except Exception as weights_err:
                    print(f"[WARN] Weight-only model load failed, trying compatibility loader: {weights_err}")
                    self.model = load_model_with_compat(settings.LEAF_MODEL_PATH)
                
                print("[INFO] Leaf Disease Model Loaded Successfully")
            else:
                 print(f"[WARN] Leaf Model not found at {settings.LEAF_MODEL_PATH}")

        except Exception as e:
            print(f"[ERROR] Error loading leaf model: {e}")

    async def predict_disease(self, image_data: bytes):
        if not self.model:
            self._load_model()
            if not self.model:
                return "Model Error", 0, {"error": "Model initialization failed"}
        
        try:
            img = Image.open(io.BytesIO(image_data)).convert('RGB')
            img = img.resize((256, 256))
            img_array = np.array(img).astype('float32') / 255.0
            img_array = np.expand_dims(img_array, axis=0)

            # Predict in thread pool to avoid blocking
            predictions = await asyncio.to_thread(self.model.predict, img_array, verbose=0)
            
            pred_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][pred_idx]) * 100
            
            disease_name = self.class_indices.get(pred_idx, "Unknown")
            
            # Treatment lookup
            treatment_info = treatment_service.get_treatment(disease_name)
            
            return disease_name, confidence, treatment_info
            
        except Exception as e:
            print(f"[ERROR] Prediction Error: {e}")
            return "Internal Error", 0, {"error": str(e)}

disease_service = DiseaseService()
