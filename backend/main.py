from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import create_tables
from routes import auth, users, packages, ai_analysis, volunteers, rewards, analytics

app = FastAPI(
    title="Waste Redistribution Platform",
    description="A volunteer-based waste redistribution system",
    version="1.0.0"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(packages.router)
app.include_router(ai_analysis.router)
app.include_router(volunteers.router)
app.include_router(rewards.router)
app.include_router(analytics.router)

@app.on_event("startup")
async def startup_event():
    """Create database tables on startup"""
    create_tables()

@app.get("/")
async def root():
    return {"message": "Waste Redistribution Platform API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
