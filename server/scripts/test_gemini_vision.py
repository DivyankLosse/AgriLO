import os
import sys
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
import requests
from io import BytesIO

# Add server directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from config import settings

def test_gemini_vision():
    key = settings.GEMINI_API_KEY
    if not key:
        print("❌ Error: GEMINI_API_KEY is missing.")
        return

    genai.configure(api_key=key)
    
    # Try 2.0-flash first as it was working (though rate limited)
    model_name = 'gemini-2.0-flash' 
    
    print(f"Testing Vision with {model_name}...")

    try:
        model = genai.GenerativeModel(model_name)
        
        # Load a small, reliable image
        url = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"❌ Failed to download image: {response.status_code}")
            return
            
        img = Image.open(BytesIO(response.content))
        print("Image loaded successfully.")

        response = model.generate_content(["Describe this logo", img])
        print(f"✅ Success! Response text: {response.text}")

    except Exception as e:
        print(f"❌ Gemini Vision Error: {e}")

if __name__ == "__main__":
    test_gemini_vision()
