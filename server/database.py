from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from config import settings

# Handle the DATABASE_URL carefully to support different drivers
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite") and "aiosqlite" not in db_url:
    db_url = db_url.replace("sqlite://", "sqlite+aiosqlite://")
elif db_url.startswith("postgres") and "asyncpg" not in db_url:
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://").replace("postgres://", "postgresql+asyncpg://")

# For production/cloud DBs (like Supabase), we might need to handle SSL
connect_args = {}
if "supabase.co" in db_url:
    # Use SSL for Supabase connections
    connect_args = {"ssl": True}

engine = create_async_engine(db_url, echo=settings.DEBUG, future=True, connect_args=connect_args)

async def init_db():
    async with engine.begin() as conn:
        # await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_session() -> AsyncSession:
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session

