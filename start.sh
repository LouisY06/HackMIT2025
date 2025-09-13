#!/bin/bash

echo "🚀 Starting Waste Redistribution Platform..."

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "❌ Virtual environment not found. Please run setup first."
    exit 1
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source backend/venv/bin/activate

# Check if database exists, if not initialize it
if [ ! -f "backend/hackathon.db" ]; then
    echo "🗄️ Initializing database..."
    cd backend
    python init_db.py
    cd ..
fi

# Start the FastAPI server
echo "🌐 Starting FastAPI server..."
echo "📱 Frontend available at: file://$(pwd)/frontend/index.html"
echo "🔗 API documentation at: http://localhost:8000/docs"
echo "🔗 API base URL: http://localhost:8000"
echo ""
echo "Test accounts:"
echo "  - volunteer@test.com / password123 (volunteer)"
echo "  - store@test.com / password123 (store)"  
echo "  - central@test.com / password123 (central_base)"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
