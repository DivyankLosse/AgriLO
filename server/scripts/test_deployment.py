import requests
import sys
import os
from PIL import Image
import io

BASE_URL = "http://localhost:5000"

def create_test_image():
    # Create a 100x100 RGB image (green square)
    img = Image.new('RGB', (100, 100), color = 'green')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    return img_byte_arr

def test_deployment():
    print("🚀 Starting Deployment Verification...")
    
    # 1. Register User
    test_user = {
        "email": "test_deploy_user@example.com",
        "password": "testpassword123",
        "name": "Test User",
        "role": "farmer",
        "location": {"city": "Test City", "country": "Test Country"}
    }
    
    # Try login first in case user exists
    print(f"1. Attempting Login/Register with {test_user['email']}...")
    login_data = {
        "username": test_user['email'],
        "password": test_user['password']
    }
    
    token = None
    
    try:
        # Try Login
        res = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
        if res.status_code == 200:
             print("✅ Login Successful.")
             token = res.json()['access_token']
        else:
            # Try Register
            print("Login failed, attempting registration...")
            res = requests.post(f"{BASE_URL}/api/auth/register", json=test_user)
            if res.status_code == 200:
                print("✅ Registration Successful.")
                token = res.json()['access_token']
            else:
                print(f"❌ Registration Failed: {res.text}")
                return

    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return

    if not token:
        print("❌ Could not obtain access token.")
        return

    # 2. Test Disease Prediction (Triggers Lazy Load)
    print("\n2. Testing Disease Prediction (Triggering Lazy Load)...")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    files = {
        'file': ('test_leaf.jpg', create_test_image(), 'image/jpeg')
    }
    
    try:
        res = requests.post(f"{BASE_URL}/api/analysis/detect", headers=headers, files=files)
        
        if res.status_code == 200:
            data = res.json()
            print("✅ Prediction Successful!")
            print(f"   Disease: {data['data']['disease']}")
            print(f"   Confidence: {data['data']['confidence']}%")
        else:
            print(f"❌ Prediction Failed: {res.status_code} - {res.text}")

    except Exception as e:
         print(f"❌ Prediction Error: {e}")

    print("\n✅ Verification Complete.")

if __name__ == "__main__":
    test_deployment()
