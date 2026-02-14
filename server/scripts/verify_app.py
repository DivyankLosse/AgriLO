import requests
import os
import glob
import sys

BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:5173"

def verify_app():
    print("=== Agri-Lo App Verification ===")
    
    # 1. Verify Frontend Reachability
    try:
        r = requests.get(FRONTEND_URL)
        if r.status_code == 200:
            print(f"[SUCCESS] Frontend is accessible at {FRONTEND_URL}")
        else:
            print(f"[WARN] Frontend returned status {r.status_code}")
    except Exception as e:
        print(f"[ERROR] Frontend not accessible: {e}")

    # 2. Verify Backend Docs (Health Check)
    try:
        r = requests.get(f"{BACKEND_URL}/docs")
        if r.status_code == 200:
            print(f"[SUCCESS] Backend is accessible at {BACKEND_URL}")
        else:
            print(f"[WARN] Backend docs returned status {r.status_code}")
    except Exception as e:
        print(f"[ERROR] Backend not accessible: {e}")
        return

    # 3. Test Disease Prediction
    print("\n--- Testing Disease Prediction ---")
    
    # Find a sample image
    image_dir = "d:/Projects/Agri-Lo/Datasets/PlantVillage-Dataset-master/raw/color/Tomato___healthy"
    images = glob.glob(os.path.join(image_dir, "*.JPG"))
    
    if not images:
        print("[WARN] No sample images found for testing.")
        return

    test_image_path = images[0]
    print(f"Testing with image: {test_image_path}")
    
    # Authenticate (Need a token if endpoint is protected)
    # The detect_disease endpoint uses 'Depends(get_current_user)'?
    # Let's check api requirements. Yes it does.
    # We need to register/login first to get a token.
    
    # Register/Login
    email = "testuser@example.com"
    password = "testpassword123"
    
    # Try Login first
    token = None
    try:
        login_data = {"username": email, "password": password}
        r = requests.post(f"{BACKEND_URL}/auth/token", data=login_data)
        if r.status_code == 200:
            token = r.json()["access_token"]
            print("[INFO] Logged in successfully.")
        else:
            # Try Register if login fails
            print("[INFO] Login failed, trying registration...")
            reg_data = {"email": email, "password": password, "full_name": "Test User"}
            r = requests.post(f"{BACKEND_URL}/auth/signup", json=reg_data)
            if r.status_code == 200 or r.status_code == 201:
                # Login again
                 r = requests.post(f"{BACKEND_URL}/auth/token", data=login_data)
                 if r.status_code == 200:
                      token = r.json()["access_token"]
                      print("[INFO] Registered and Logged in.")
    except Exception as e:
        print(f"[ERROR] Auth failed: {e}")
        
    if not token:
        print("[ERROR] Could not get auth token. Skipping prediction test.")
        return

    # Predict
    headers = {"Authorization": f"Bearer {token}"}
    files = {'file': open(test_image_path, 'rb')}
    
    try:
        r = requests.post(f"{BACKEND_URL}/analysis/detect", headers=headers, files=files)
        print(f"Prediction Status: {r.status_code}")
        print("Response:", r.text)
        
        if r.status_code == 200:
            data = r.json()
            if data["status"] == "success":
                disease = data["data"]["disease"]
                confidence = data["data"]["confidence"]
                print(f"[RESULT] Disease: {disease}, Confidence: {confidence}%")
                
                if "healthy" in disease.lower() or disease == "Unknown":
                     print("[SUCCESS] Prediction seems reasonable (Healthy or Unknown due to threshold).")
                else:
                     print("[WARN] Prediction might be a false positive if image was healthy.")

    except Exception as e:
        print(f"[ERROR] Prediction request failed: {e}")

if __name__ == "__main__":
    verify_app()
