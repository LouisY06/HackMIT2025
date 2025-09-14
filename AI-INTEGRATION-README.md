# 🌱 Reflourish AI Integration

This document describes the AI-powered analytics and insights system integrated into the Reflourish platform.

## 🚀 Features

### AI-Powered Analytics
- **Global Impact Dashboard**: Platform-wide metrics and insights
- **Store AI Insights**: Store-specific performance analytics and recommendations
- **Volunteer AI Insights**: Personalized volunteer performance tracking and suggestions
- **Real-time Data Processing**: Live analytics from package and pickup data
- **Environmental Impact Tracking**: CO2 emissions prevented and meals provided calculations

### Key Metrics Tracked
- **Waste Diverted**: Total weight of food waste diverted from landfills
- **Completion Rates**: Success rate of package pickups
- **Environmental Impact**: CO2 emissions prevented, meals provided, families helped
- **Financial Impact**: Retail value saved and disposal cost savings
- **Performance Scores**: AI-calculated efficiency and performance metrics

## 🏗️ Architecture

### Backend (Flask)
- **Port**: 5001
- **Database**: SQLite (packages.db)
- **AI Endpoints**: `/api/ai/*`

### Frontend (React)
- **Port**: 3000
- **AI Components**: 
  - `GlobalAIImpact.tsx`
  - `StoreAIInsights.tsx`
  - `VolunteerAIInsights.tsx`

## 📡 API Endpoints

### Global Metrics
```http
GET /api/ai/global-metrics?days=30
```
Returns platform-wide analytics including total waste diverted, active stores/volunteers, completion rates, and environmental impact.

### Store Insights
```http
GET /api/ai/store-insights/{store_email}?days=30
```
Returns store-specific analytics including performance metrics, financial impact, and food type breakdown.

### Volunteer Insights
```http
GET /api/ai/volunteer-insights/{volunteer_id}?days=30
```
Returns volunteer-specific analytics including pickup history, efficiency ratings, and achievement progress.

### Heatmap Data
```http
GET /api/ai/heatmap-data?days=30
```
Returns data for waste heatmap visualization showing store performance and risk levels.

### Weekly Report
```http
POST /api/ai/weekly-report
Content-Type: application/json

{
  "store_email": "store@example.com",
  "days": 7
}
```
Generates AI-powered weekly reports with insights and recommendations.

## 🚀 Quick Start

### Option 1: Start Everything at Once
```bash
cd frontend
npm run start:ai
```

### Option 2: Start Services Separately
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
```

### Option 3: Using the Startup Script
```bash
./start_ai_system.sh
```

## 🧪 Testing the AI System

### 1. Create Test Data
The system includes sample data, but you can add more:

```python
# Add test packages to the database
import sqlite3
from datetime import datetime

conn = sqlite3.connect('backend/packages.db')
cursor = conn.cursor()

cursor.execute('''
    INSERT INTO packages (store_name, store_email, weight_lbs, food_type, 
                        pickup_window_start, pickup_window_end, status, volunteer_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
''', ('Test Store', 'test@example.com', 15.5, 'Bakery Items', 
      '2024-01-15T10:00:00', '2024-01-15T12:00:00', 'completed', 'volunteer-1'))

conn.commit()
conn.close()
```

### 2. Test API Endpoints
```bash
# Test global metrics
curl "http://localhost:5001/api/ai/global-metrics?days=30"

# Test store insights
curl "http://localhost:5001/api/ai/store-insights/test@example.com?days=30"

# Test volunteer insights
curl "http://localhost:5001/api/ai/volunteer-insights/volunteer-1?days=30"
```

### 3. View AI Dashboards
1. Open http://localhost:3000
2. Navigate to the AI components:
   - Global AI Impact Dashboard
   - Store AI Insights
   - Volunteer AI Insights

## 📊 AI Components

### GlobalAIImpact.tsx
- **Purpose**: Platform-wide analytics dashboard
- **Features**: 
  - Total waste diverted metrics
  - Active stores and volunteers count
  - Environmental impact calculations
  - Top performing stores and food types
  - Platform efficiency scoring

### StoreAIInsights.tsx
- **Purpose**: Store-specific performance analytics
- **Features**:
  - Store performance scoring
  - Financial impact calculations
  - Environmental impact tracking
  - Food type breakdown analysis
  - AI-generated recommendations

### VolunteerAIInsights.tsx
- **Purpose**: Volunteer performance tracking and insights
- **Features**:
  - Pickup history and statistics
  - Efficiency ratings and performance scores
  - Achievement progress tracking
  - Personalized recommendations
  - Preferred food types and stores analysis

## 🔧 Configuration

### Environment Variables
The system uses default configurations, but you can customize:

```bash
# Backend configuration (optional)
export FLASK_ENV=development
export PORT=5001

# Frontend configuration (optional)
export REACT_APP_API_URL=http://localhost:5001
```

### Database Schema
The AI system uses the existing `packages` table with these key fields:
- `store_name`, `store_email`: Store identification
- `weight_lbs`: Package weight for calculations
- `food_type`: Food category for breakdown analysis
- `status`: Package status for completion rate calculations
- `volunteer_id`: Volunteer identification
- `created_at`, `pickup_completed_at`: Timestamps for time-based analytics

## 📈 Analytics Calculations

### Environmental Impact
- **CO2 Prevented**: `weight_lbs * 2.5` (kg CO2 per kg food)
- **Meals Provided**: `weight_lbs * 2.3` (meals per kg)
- **Families Helped**: `completed_packages * 1.2` (families per pickup)

### Financial Impact
- **Retail Value Saved**: `weight_lbs * $3.5` (per lb)
- **Disposal Cost Savings**: `weight_lbs * $0.15` (per lb)
- **Total Financial Impact**: Retail value + disposal savings

### Performance Scoring
- **Store Performance**: `completion_rate * 0.7 + efficiency_score * 0.3`
- **Platform Efficiency**: `completion_rate * 0.8 + time_efficiency * 0.2`
- **Volunteer Performance**: `(pickups * 5) + (weight * 0.5)`

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes on ports 3000 and 5001
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5001 | xargs kill -9
   ```

2. **Database Connection Issues**
   ```bash
   # Check if database exists
   ls -la backend/packages.db
   
   # Recreate database if needed
   cd backend && python -c "from app import init_db; init_db()"
   ```

3. **Frontend Build Issues**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```

4. **API Endpoint Errors**
   ```bash
   # Check if backend is running
   curl http://localhost:5001/api/health
   
   # Check backend logs
   cd backend && python app.py
   ```

### Debug Mode
To run in debug mode:

```bash
# Backend debug
cd backend
FLASK_DEBUG=1 python app.py

# Frontend debug
cd frontend
REACT_APP_DEBUG=true npm start
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/build/
# The Flask app will serve these files automatically
```

### Environment Setup
```bash
# Install dependencies
cd frontend && npm install
cd ../backend && pip install -r requirements.txt

# Start services
./start_ai_system.sh
```

## 📝 Development

### Adding New AI Features
1. **Backend**: Add new endpoints in `backend/app.py`
2. **Frontend**: Create new components in `frontend/src/components/`
3. **Database**: Add new tables/fields as needed
4. **Testing**: Test with sample data and API calls

### Code Structure
```
backend/
├── app.py                 # Main Flask app with AI endpoints
├── packages.db           # SQLite database
└── requirements.txt      # Python dependencies

frontend/src/components/
├── GlobalAIImpact.tsx    # Global analytics dashboard
├── StoreAIInsights.tsx   # Store-specific insights
└── VolunteerAIInsights.tsx # Volunteer analytics

ai-integration/           # Advanced AI features (optional)
├── app/                 # FastAPI AI service
└── requirements.txt     # AI-specific dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review the API endpoint documentation
- Test with sample data
- Check browser console and network tabs for errors

---

**Built with ❤️ for Reflourish - Fighting Food Waste with AI**
