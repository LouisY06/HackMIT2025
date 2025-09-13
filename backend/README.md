# Waste Redistribution Platform - Backend

A FastAPI-based backend for the waste redistribution platform.

## Setup

1. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual API keys
```

4. Run the development server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

## Project Structure

```
backend/
├── main.py              # FastAPI application
├── models/              # SQLAlchemy database models
├── routes/              # API route handlers
├── utils/               # Utility functions
├── requirements.txt     # Python dependencies
└── .env.example        # Environment variables template
```
