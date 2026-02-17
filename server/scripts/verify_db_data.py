import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlmodel import Session, create_engine, select, func
from config import settings
from models import SoilData

# Use sync engine
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "farming.db")
SYNC_DATABASE_URL = f"sqlite:///{DB_PATH}"
engine = create_engine(SYNC_DATABASE_URL)

def check_data():
    with Session(engine) as session:
        statement = select(func.count(SoilData.id))
        results = session.exec(statement)
        count = results.one()
        print(f"Total SoilData records: {count}")
        
        if count > 0:
            latest = session.exec(select(SoilData).order_by(SoilData.timestamp.desc()).limit(1)).first()
            print(f"Latest record: {latest}")

if __name__ == "__main__":
    check_data()
