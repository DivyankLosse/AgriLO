import sys
import os
import pytest
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# Add server directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from main import app
from database import init_db

client = TestClient(app)

def test_register_and_login():
    print("\n--- Testing Registration ---")
    random_id = os.urandom(4).hex()
    email = f"test_{random_id}@example.com"
    password = "StrongPassword123!"
    
    register_data = {
        "email": email,
        "password": password,
        "name": "Test User",
        "phone": "1234567890"
    }
    
    response = client.post("/api/auth/register", json=register_data)
    print(f"Register Status: {response.status_code}")
    print(f"Register Response: {response.text}")
    
    if response.status_code != 200:
        print("❌ Registration Failed")
        return

    print("\n--- Testing Login ---")
    login_data = {
        "username": email,
        "password": password
    }
    
    response = client.post("/api/auth/login", data=login_data)
    print(f"Login Status: {response.status_code}")
    print(f"Login Response: {response.text}")

    if response.status_code == 200:
        print("✅ Login Success")
    else:
        print("❌ Login Failed")

if __name__ == "__main__":
    # Ensure DB is initialized (though app startup usually does this)
    test_register_and_login()
