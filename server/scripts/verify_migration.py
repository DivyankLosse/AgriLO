import asyncio
import os
import sys

# Add server directory to python path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from database import init_db, get_session, engine
from models import User, SoilData, UserRole
from sqlmodel import select
from config import settings

async def verify_migration():
    print("--- Starting Migration Verification ---")
    
    # 1. Initialize DB
    print("1. Initializing Database...")
    try:
        await init_db()
        print("   Database initialized successfully.")
    except Exception as e:
        print(f"   FAILED to initialize database: {e}")
        return

    # 2. Check Database File
    if os.path.exists("farming.db"):
        print("2. 'farming.db' file found.")
    else:
        print("2. FAILED: 'farming.db' not found.")
        return

    # 3. Test User Creation
    print("3. Testing User Creation...")
    async with engine.begin() as conn:
        # Use session
        from sqlalchemy.orm import sessionmaker
        from sqlalchemy.ext.asyncio import AsyncSession
        async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        
        async with async_session() as session:
            # Check if user exists
            result = await session.execute(select(User).where(User.email == "test@example.com"))
            existing_user = result.scalars().first()
            
            if existing_user:
                print("   User already exists, skipping creation.")
                user_id = existing_user.id
            else:
                new_user = User(
                    email="test@example.com",
                    hashed_password="hashed_secret",
                    name="Test Farmer",
                    role=UserRole.FARMER.value
                )
                session.add(new_user)
                await session.commit()
                await session.refresh(new_user)
                print(f"   User created with ID: {new_user.id}")
                user_id = new_user.id

    # 4. Test Soil Data
    print("4. Testing Soil Data Insertion (Mock MQTT)...")
    try:
        # Import Sync Engine from MQTT service to test it too? 
        # Or just test async insertion here.
        async with async_session() as session:
             soil_data = SoilData(
                 node_id="test_node",
                 nitrogen=100, phosphorus=50, potassium=100,
                 ph=6.5, moisture=30.0, temperature=25.0, ec=1.2
             )
             session.add(soil_data)
             await session.commit()
             print("   Soil Data inserted.")
    except Exception as e:
        print(f"   FAILED to insert Soil Data: {e}")

    print("--- Verification Complete ---")

if __name__ == "__main__":
    asyncio.run(verify_migration())
