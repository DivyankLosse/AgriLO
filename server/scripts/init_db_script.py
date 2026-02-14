import asyncio
import os
import sys

# Add server directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from database import engine, init_db
from models import User # Ensure models are loaded
from sqlalchemy import text # Correct import for text()

async def check_db():
    print("Initializing Database...")
    await init_db()
    
    print("\nChecking Tables...")
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
        tables = result.fetchall()
        print("Tables found:", [t[0] for t in tables])

if __name__ == "__main__":
    asyncio.run(check_db())
