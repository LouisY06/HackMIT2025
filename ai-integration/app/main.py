from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import ingest, insights, forecast, reports, ai
from .db import engine
from .models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Reflourish AI Integration API",
    description="AI-powered food waste analytics and forecasting",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ingest.router)
app.include_router(insights.router)
app.include_router(forecast.router)
app.include_router(reports.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"message": "Reflourish AI Integration API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-integration"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
