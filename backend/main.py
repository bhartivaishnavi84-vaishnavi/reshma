import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from backend.app.config import settings
from backend.app.init_db import init_db
from backend.app.middleware import ErrorHandlingMiddleware, register_exception_handlers

# Routers
from backend.app.routers.auth_router import router as auth_router
from backend.app.routers.interview_router import router as interview_router
from backend.app.routers.ai_router import router as ai_router
from backend.app.routers.plan_router import router as plan_router
from backend.app.routers.performance_router import router as performance_router
from backend.app.routers.resume_router import router as resume_router

logger = logging.getLogger("uvicorn")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-stack AI Mock Interview Platform API with Gemini scoring and adaptive prep plans.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Exception handlers and error formatting middleware
register_exception_handlers(app)
app.add_middleware(ErrorHandlingMiddleware)

# CORS configuration
allowed_origin = settings.CORS_ORIGIN
app.add_middleware(
    CORSMiddleware,
    allow_origins=[allowed_origin, "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(interview_router)
app.include_router(ai_router)
app.include_router(plan_router)
app.include_router(performance_router)
app.include_router(resume_router)

@app.on_event("startup")
def on_startup():
    try:
        init_db()
    except Exception as e:
        logger.error(f"Error during startup DB initialization: {e}")

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "message": "AI Mock Interview API is fully operational."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
