import sys
import os
import asyncio
import io
from PIL import Image

# Add server directory to python path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from services.disease_service import disease_service
from config import settings

async def test_model():
    print(f"Checking model path: {settings.LEAF_MODEL_PATH}")
    if not os.path.exists(settings.LEAF_MODEL_PATH):
        print("Model file not found. Waiting for training to complete...")
        return

    import traceback
    try:
        # Service initializes model in __init__, but we can force reload to be sure
        disease_service._load_model()
    except:
        traceback.print_exc()
    
    if not disease_service.model:
        print("Failed to load model.")
        return

    print("Model loaded successfully.")
    
    # Test with user provided image
    test_image_path = r"D:\Projects\Agri-Lo\curling-tomato-leaves-1024x576.webp"
    
    if not os.path.exists(test_image_path):
        print(f"User image not found at {test_image_path}")
    
    print(f"Testing with image: {test_image_path}")
    
    if os.path.exists(test_image_path):
        with open(test_image_path, "rb") as f:
            image_data = f.read()
            
        disease, confidence, treatment = await disease_service.predict_disease(image_data)
        
        print(f"Prediction: {disease}")
        print(f"Confidence: {confidence:.2f}%")
        print(f"Treatment: {treatment}")
    else:
        print("Test image not found.")

if __name__ == "__main__":
    asyncio.run(test_model())
