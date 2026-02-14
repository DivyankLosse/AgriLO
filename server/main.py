from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routers import analysis, chat, auth, root_analysis, analytics, support, users, soil_data, appointments
import models
from fastapi.staticfiles import StaticFiles
import os
from database import init_db
from services.mqtt import mqtt_service
import asyncio

app = FastAPI(title="Agri-Lo API", description="Backend for Agri-Lo Smart Farming App")

@app.on_event("startup")
async def start_db():
    await init_db()
    mqtt_service.start()

@app.on_event("shutdown")
async def shutdown():
    mqtt_service.stop()

# Mount Static Files
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS Middleware
origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
