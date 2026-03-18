import os
os.environ["TF_USE_LEGACY_KERAS"] = "0"

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from utils.limiter import limiter
from slowapi.errors import RateLimitExceeded

import uvicorn

from routers import (
    analysis, chat, auth, root_analysis,
    analytics, support, users, soil_data, appointments
)
from database import init_db
from config import settings
from services.mqtt import mqtt_service


from services.firebase_service import firebase_service

# ------------------ Create App ------------------

app = FastAPI(
    title="Agri-Lo API",
    description="Backend for Agri-Lo Smart Farming App"
)

# ------------------ CORS (FIXED) ------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------ PREVENT OPTIONS ISSUES ------------------

@app.options("/{full_path:path}")
async def preflight_handler():
    return {"ok": True}


# ------------------ LIMITER SETUP (FIXED) ------------------

app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests"},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
    )


# ------------------ GLOBAL ERROR HANDLER (VERY IMPORTANT) ------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
    )


# ------------------ Startup / Shutdown ------------------

@app.on_event("startup")
async def startup_event():
    # 1. Initialize DB
    await init_db()
    
    # 2. Initialize Firebase
    firebase_service.initialize()
    
    # 3. Start MQTT
    mqtt_service.start()

@app.on_event("shutdown")
async def shutdown_event():
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


# ------------------ Root ------------------

@app.get("/")
async def root():
    return {"message": "Agri-Lo API is running 🚀 (Python/FastAPI)"}

# ------------------ Run Server ------------------

if __name__ == "__main__":
    # Render uses PORT env var, default to 10000 for stability
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        proxy_headers=True
    )