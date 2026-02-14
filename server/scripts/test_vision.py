import os
import sys
from dotenv import load_dotenv
import base64

# Add server directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from config import settings
from groq import Groq

def test_vision():
    key = settings.GROQ_API_KEY
    if not key:
        print("❌ Error: GROQ_API_KEY is missing.")
        return

    client = Groq(api_key=key)
    model_name = "llama-3.2-90b-vision-preview" 

    image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"

    print(f"Testing Vision with {model_name}...")
    try:
        completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "What's in this image?"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_url
                            }
                        }
                    ]
                }
            ],
            temperature=1,
            max_tokens=1024,
            top_p=1,
            stream=False,
            stop=None,
        )
        print(f"✅ Success! Response: {completion.choices[0].message.content}")
    except Exception as e:
        print(f"❌ Vision Error: {e}")

if __name__ == "__main__":
    test_vision()
