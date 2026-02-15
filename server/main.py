import os


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

from routers import (
    analysis, chat, auth, root_analysis,
    analytics, support, users, soil_data, appointments
)
from database import init_db
from services.mqtt import mqtt_service

# Create FastAPI app
app = FastAPI(
    title="Agri-Lo API",
    description="Backend for Agri-Lo Smart Farming App"
)

# ------------------ CORS (ADD THIS FIRST) ------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://agri-lo-phi.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ------------------ Startup / Shutdown ------------------

@app.on_event("startup")
async def start_db():
    await init_db()
    mqtt_service.start()

@app.on_event("shutdown")
async def shutdown():
    mqtt_service.stop()

# ------------------ Static Files ------------------

os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# ------------------ Routers ------------------

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(root_analysis.router, prefix="/api/root", tags=["Root Health"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(support.router, prefix="/api/support", tags=["Support"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(soil_data.router, prefix="/api/soil", tags=["Soil Data"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])

@app.get("/")
async def root():
    return {"message": "Agri-Lo API is running 🚀 (Python/FastAPI)"}

# ------------------ Run Server ------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        proxy_headers=True
    )
