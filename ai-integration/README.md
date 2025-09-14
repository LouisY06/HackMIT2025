# 🌱 Reflourish AI Integration Module

A comprehensive AI-powered backend system for food waste analytics, forecasting, and optimization for the Reflourish platform.

## 🚀 Features

- **Real-time Data Ingestion**: REST APIs for waste logs, pickup scans, and distributions
- **ML-Powered Forecasting**: Time series prediction using Prophet and scikit-learn
- **AI-Generated Reports**: Weekly insights using OpenAI and Anthropic LLMs
- **Interactive Dashboard**: Streamlit-based analytics dashboard
- **Automated Scheduling**: Nightly metrics materialization and weekly model retraining
- **Carbon & Financial Impact**: Automated CO2e and dollar loss calculations

## 🏗️ Architecture

```
ai-integration/
├── app/                    # FastAPI application
│   ├── main.py            # FastAPI app + routes
│   ├── config.py          # Environment configuration
│   ├── db.py              # Database connection
│   ├── models.py          # SQLAlchemy ORM models
│   ├── schemas.py         # Pydantic schemas
│   ├── routers/           # API endpoints
│   │   ├── ingest.py      # Data ingestion APIs
│   │   ├── insights.py    # Analytics APIs
│   │   ├── forecast.py    # Prediction APIs
│   │   └── reports.py     # AI report generation
│   ├── services/          # Business logic
│   │   ├── carbon.py      # CO2e calculations
│   │   ├── finance.py     # Financial impact
│   │   └── matching.py    # Volunteer/foodbank matching
│   ├── ml/                # Machine learning
│   │   ├── features.py    # Feature engineering
│   │   ├── train.py       # Model training
│   │   └── predict.py     # Predictions
│   ├── ai/                # LLM integration
│   │   ├── providers.py   # OpenAI/Anthropic clients
│   │   ├── prompts.py     # Prompt templates
│   │   └── report.py      # Report generation
│   └── jobs/              # Scheduled tasks
│       └── scheduler.py   # APScheduler configuration
├── dashboard/             # Streamlit dashboard
│   └── app.py            # Dashboard application
├── alembic/              # Database migrations
└── requirements.txt      # Python dependencies
```

## 🛠️ Setup

### 1. Environment Setup

```bash
# Clone and navigate to the AI integration module
cd ai-integration

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Variables

Copy the example environment file and configure:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/reflourish
SECRET_KEY=your_secret_key_here
DASHBOARD_TOKEN=your_dashboard_token_here
TZ=America/New_York

# LLM providers
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
LLM_PROVIDER_PRIMARY=openai
LLM_PROVIDER_FALLBACK=anthropic
OPENAI_MODEL=gpt-4o-mini
ANTHROPIC_MODEL=claude-3-7-sonnet
```

### 3. Database Setup

```bash
# Initialize Alembic
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Run migrations
alembic upgrade head
```

### 4. Start the Services

```bash
# Start the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000

# In another terminal, start the dashboard
streamlit run dashboard/app.py --server.port 8501
```

## 📡 API Endpoints

### Data Ingestion
- `POST /ingest/waste-log` - Record waste events
- `POST /ingest/pickup-scan` - Record pickup scans
- `POST /ingest/distribution` - Record distributions

### Analytics
- `GET /metrics/daily` - Get daily metrics
- `GET /metrics/weekly/{store_id}` - Get weekly insights

### Forecasting
- `GET /forecast/next-week` - Get next week predictions
- `POST /forecast/generate/{store_id}` - Generate forecasts

### AI Reports
- `GET /reports/weekly/{store_id}` - Generate AI-powered weekly report

## 🤖 AI Integration

### LLM Providers
- **Primary**: OpenAI GPT-4o-mini
- **Fallback**: Anthropic Claude-3.7-Sonnet
- **Features**: Structured JSON output, error handling, provider switching

### Report Generation
AI reports include:
- Key findings and insights
- Store-specific recommendations
- Risk assessments
- Order change suggestions
- Environmental impact summaries

### Example AI Report Response:
```json
{
  "report": "## Weekly Analysis\n\nYour store showed...",
  "key_findings": [
    "Waste increased 15% compared to last week",
    "Bread items showing highest waste rates"
  ],
  "store_actions": [
    {
      "store_id": 1,
      "actions": [
        "Reduce bread ordering by 20%",
        "Implement earlier pickup times for dairy"
      ]
    }
  ],
  "risks": [
    "High waste trend continuing",
    "Volunteer capacity constraints"
  ],
  "next_week_order_changes": [
    {
      "store_id": 1,
      "item_id": 5,
      "percent_delta": -20.0
    }
  ]
}
```

## 📊 Dashboard

The Streamlit dashboard provides:

### Store Analytics
- Daily waste tracking
- Collection efficiency metrics
- Financial impact visualization
- CO2e impact tracking

### AI Reports
- Interactive report generation
- Key findings display
- Recommendation tracking
- Order change suggestions

### Platform Analytics
- Cross-store comparisons
- Trend analysis
- Forecast visualization

## ⏰ Scheduled Jobs

### Nightly Jobs (2:00 AM)
- Materialize daily metrics from raw events
- Calculate CO2e and financial impacts
- Update efficiency scores

### Weekly Jobs (Sunday 3:00 AM)
- Retrain ML models with new data
- Generate next-week forecasts
- Create AI insights and recommendations

## 🧪 Testing

### Sample Data Creation
```python
# Create sample waste log
import requests

waste_data = {
    "store_id": 1,
    "item_id": 1,
    "kg": 5.5,
    "event_ts": "2024-01-15T10:30:00"
}

response = requests.post("http://localhost:8000/ingest/waste-log", json=waste_data)
```

### Generate AI Report
```python
# Get AI report for store
response = requests.get("http://localhost:8000/reports/weekly/1")
report = response.json()
print(report["report"])
```

## 🔧 Development

### Adding New Features
1. Create database models in `models.py`
2. Add Pydantic schemas in `schemas.py`
3. Implement business logic in `services/`
4. Create API endpoints in `routers/`
5. Update dashboard in `dashboard/app.py`

### ML Model Enhancement
1. Modify feature engineering in `ml/features.py`
2. Update training logic in `ml/train.py`
3. Enhance predictions in `ml/predict.py`

### LLM Integration
1. Add new prompts in `ai/prompts.py`
2. Extend providers in `ai/providers.py`
3. Create new report types in `ai/report.py`

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Replit Deployment
The module is configured for Replit with:
- `.replit` configuration
- `replit.nix` for system dependencies
- Automatic startup scripts

## 📈 Performance

- **API Response Time**: < 200ms for most endpoints
- **ML Training**: ~2-5 minutes for store-level models
- **Report Generation**: 10-30 seconds for AI reports
- **Dashboard Load**: < 3 seconds for analytics views

## 🔒 Security

- JWT-based authentication for API endpoints
- Token-based dashboard access
- Environment variable configuration
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy

## 📝 License

This AI integration module is part of the Reflourish platform and follows the same licensing terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests and documentation
5. Submit a pull request

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

**Built with ❤️ for Reflourish - Fighting Food Waste with AI**
