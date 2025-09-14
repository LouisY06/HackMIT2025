#!/bin/bash

# Reflourish AI Integration Startup Script
echo "🌱 Starting Reflourish AI Integration System..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Please copy env.example to .env and configure your settings."
    echo "   cp env.example .env"
    echo "   Then edit .env with your database URL and API keys."
    exit 1
fi

# Start the FastAPI server in background
echo "🚀 Starting FastAPI server on port 8000..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
FASTAPI_PID=$!

# Wait a moment for the server to start
sleep 3

# Start the scheduler
echo "⏰ Starting background scheduler..."
python -c "
from app.jobs.scheduler import start_scheduler
import time
start_scheduler()
print('Scheduler started successfully')
try:
    while True:
        time.sleep(60)
except KeyboardInterrupt:
    print('Scheduler stopped')
"

# Start Streamlit dashboard (optional)
echo "📊 To start the dashboard, run in another terminal:"
echo "   source venv/bin/activate"
echo "   streamlit run dashboard/app.py --server.port 8501"

echo "✅ AI Integration system started!"
echo "   FastAPI API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Dashboard: http://localhost:8501 (when started)"

# Wait for background processes
wait $FASTAPI_PID
