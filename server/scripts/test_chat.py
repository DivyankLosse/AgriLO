import os
import sys
import traceback

# Add server directory to path so we can import config
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from config import settings
import google.generativeai as genai

def test_chat():
    key = settings.GEMINI_API_KEY
    if not key:
        print("Error: GEMINI_API_KEY is missing.")
        return
        
    # Mask key for security in logs
    masked_key = key[:5] + "..." + key[-4:] if len(key) > 8 else "..."
    print(f"Checking API Key: {masked_key}")

    # using the working model
    models_to_test = ['gemini-1.5-flash-8b']
    
    genai.configure(api_key=key)

    for model_name in models_to_test:
        print(f"\nTesting {model_name}...")
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hi")
            print(f"Success! Response: {response.text}")
        except Exception:
            print(f"Generation Error with {model_name}:")
            traceback.print_exc()

if __name__ == "__main__":
    test_chat()
