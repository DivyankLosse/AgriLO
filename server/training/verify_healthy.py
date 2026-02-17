import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import os
import json
import numpy as np

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "../models")
MODEL_PATH = os.path.join(MODEL_DIR, "final_model_v2.h5")
INDICES_PATH = os.path.join(MODEL_DIR, "class_indices_v2.json")
DATASET_DIR = r"d:\Projects\Agri-Lo\Datasets\plantvillage dataset\color"

IMG_SIZE = (256, 256)

def verify_healthy():
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model not found at {MODEL_PATH}")
        return

    if not os.path.exists(INDICES_PATH):
        print(f"Error: Indices not found at {INDICES_PATH}")
        return

    # Load Model and Indices
    print("Loading model...")
    model = tf.keras.models.load_model(MODEL_PATH)
    
    with open(INDICES_PATH, 'r') as f:
        class_indices = json.load(f)
    
    # Invert indices
    idx_to_class = {v: k for k, v in class_indices.items()}

    # Find healthy classes
    healthy_classes = [c for c in class_indices.keys() if "healthy" in c.lower()]
    print(f"Healthy classes found: {healthy_classes}")

    correct = 0
    total = 0

    for h_cls in healthy_classes:
        cls_path = os.path.join(DATASET_DIR, h_cls)
        if not os.path.exists(cls_path):
            continue
            
        images = [f for f in os.listdir(cls_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        # Test a sample of 10 images per healthy class
        sample_size = min(10, len(images))
        test_images = np.random.choice(images, sample_size, replace=False)
        
        print(f"Testing {h_cls}...")
        for img_name in test_images:
            img_path = os.path.join(cls_path, img_name)
            img = load_img(img_path, target_size=IMG_SIZE)
            x = img_to_array(img) / 255.0
            x = np.expand_dims(x, axis=0)
            
            preds = model.predict(x, verbose=0)
            pred_idx = np.argmax(preds[0])
            pred_label = idx_to_class[pred_idx]
            confidence = preds[0][pred_idx] * 100
            
            total += 1
            if "healthy" in pred_label.lower():
                correct += 1
                print(f"  [OK] {img_name}: Predicted {pred_label} ({confidence:.2f}%)")
            else:
                print(f"  [FAIL] {img_name}: Predicted {pred_label} ({confidence:.2f}%)")

    if total > 0:
        accuracy = (correct / total) * 100
        print(f"\nFinal Healthy Class Accuracy: {accuracy:.2f}% ({correct}/{total})")
    else:
        print("No healthy images tested.")

if __name__ == "__main__":
    verify_healthy()
