# Reflourish AI Integration Guide

## 🤖 AI Integration Overview

The Reflourish platform now includes comprehensive AI-powered analytics and insights to optimize food waste reduction efforts across stores, volunteers, and food banks.

## 🏗️ AI System Architecture

### Backend Components

1. **AI Models (`ai_models.py`)**
   - `WasteAnalytics`: Core analytics engine for waste data analysis
   - `WastePredictor`: Predictive models for inventory forecasting and volunteer optimization
   - `AIInsightsGenerator`: Natural language report generation using Anthropic Claude API

2. **AI API (`ai_api.py`)**
   - FastAPI server providing AI analytics endpoints
   - Real-time insights and recommendations
   - Weekly report generation

3. **AI Scheduler (`ai_scheduler.py`)**
   - Automated weekly report generation
   - Daily prediction updates
   - Background analytics processing

4. **Enhanced Database Schema**
   - AI analytics tables for historical tracking
   - Performance metrics storage
   - Trend analysis data

### Frontend Components

1. **Store AI Insights (`StoreAIInsights.tsx`)**
   - Performance analytics for store managers
   - Financial and environmental impact tracking
   - AI-generated recommendations

2. **Volunteer AI Insights (`VolunteerAIInsights.tsx`)**
   - Personalized volunteer performance analytics
   - Efficiency optimization suggestions
   - Achievement progress tracking

3. **Global AI Impact (`GlobalAIImpact.tsx`)**
   - Platform-wide analytics dashboard
   - Store performance heatmap
   - AI-generated platform insights

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- Anthropic API key (provided)

### Installation

1. **Start the AI System:**
   ```bash
   chmod +x start_ai_system.sh
   ./start_ai_system.sh
   ```

2. **Manual Setup (Alternative):**
   ```bash
   # Backend setup
   cd backend
   pip install -r ai_requirements.txt
   python app.py  # Starts main Flask app with AI endpoints
   python ai_api.py  # Starts dedicated AI API server
   python ai_scheduler.py  # Starts AI analytics scheduler
   
   # Frontend setup
   cd frontend
   npm start
   ```

### Accessing AI Features

- **Store AI Insights**: Navigate to `/store/ai-insights` from store dashboard
- **Volunteer AI Insights**: Navigate to `/volunteer/ai-insights` from volunteer dashboard
- **Global AI Impact**: Navigate to `/global-ai-impact` for platform-wide analytics

## 📊 AI Features

### 1. Weekly AI-Generated Reports

**Inputs:**
- Store-uploaded food waste logs (type, weight, value)
- Volunteer pickup scans (QR code confirmations)
- Distribution center confirmations

**Processing:**
- AI model aggregates 7 days of data
- Identifies waste trends by store, food type, time of day
- Estimates financial loss (retail value of wasted goods)
- Calculates carbon footprint impact

**Outputs:**
- Daily waste breakdown (e.g., 12kg bread, 5kg produce, 2kg meat)
- Net profit loss per store/week
- Carbon footprint avoided vs actual
- Heatmap of high-waste stores

### 2. Predictive AI Suggestions

**Inventory Forecasting:**
- Predicts next week's likely waste per food category
- Recommends reduced ordering amounts for high-waste items
- Auto-alerts for waste reduction opportunities

**Volunteer Optimization:**
- Learns which volunteers pick up fastest
- Suggests optimized matching (right volunteer for right store)
- Personalized efficiency recommendations

**Food Bank Demand Matching:**
- Predicts which food banks need which items
- Auto-suggests distribution routes to minimize storage loss

### 3. AI-Enhanced User Experience

**Store Dashboard:**
- Weekly "AI Insights" tab with suggested order quantities
- Auto-alert: "You threw away 20kg lettuce last week. Reduce order by 15% next cycle."
- Performance scoring and optimization tips

**Volunteer Dashboard:**
- Personalized badges for "most efficient pickups"
- Suggested times/locations for volunteering
- Achievement progress tracking

**Food Bank Dashboard:**
- Predicts incoming donation type/quantity
- Helps plan staffing and storage capacity

## 🔧 API Endpoints

### AI Analytics Endpoints

- `POST /api/ai/weekly-report` - Generate comprehensive weekly AI report
- `GET /api/ai/store-insights/{store_email}` - Get AI insights for specific store
- `GET /api/ai/global-metrics` - Get platform-wide AI metrics
- `GET /api/ai/heatmap-data` - Get waste heatmap data for visualization

### Example API Usage

```javascript
// Get store AI insights
const response = await fetch('/api/ai/store-insights/store@example.com?days=30');
const data = await response.json();

// Generate weekly report
const reportResponse = await fetch('/api/ai/weekly-report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ store_email: 'store@example.com', days: 7 })
});
```

## 🧠 AI Models

### Waste Analytics Engine
- **Time Series Analysis**: Identifies patterns in waste generation
- **Food Type Classification**: Categorizes and analyzes waste by type
- **Store Performance Metrics**: Tracks completion rates and efficiency

### Predictive Models
- **Inventory Forecasting**: Prophet-based time series prediction
- **Volunteer Optimization**: Random Forest for volunteer-store matching
- **Demand Prediction**: Classification models for food bank needs

### Natural Language Generation
- **Anthropic Claude Integration**: Generates human-readable insights
- **Structured Reports**: Fallback to template-based reports
- **Personalized Recommendations**: Tailored advice for each user type

## 📈 Key Metrics Tracked

### Store Metrics
- Total waste diverted (lbs)
- Package completion rate
- Average pickup time
- Financial impact (retail value + disposal savings)
- Environmental impact (CO₂e prevented)

### Volunteer Metrics
- Total pickups completed
- Average pickup time
- Efficiency score
- Environmental impact
- Achievement progress

### Platform Metrics
- Total waste diverted across platform
- Active stores and volunteers
- Platform efficiency score
- Top performing stores
- Waste risk heatmap

## 🔮 Future Enhancements

### Advanced AI Features
- **Computer Vision**: Analyze food quality from photos
- **Demand Forecasting**: Predict food bank needs
- **Route Optimization**: AI-powered delivery routing
- **Fraud Detection**: Identify suspicious patterns

### Integration Opportunities
- **IoT Sensors**: Real-time waste tracking
- **Weather Data**: Predict waste based on weather patterns
- **Economic Indicators**: Correlate waste with economic factors
- **Social Media**: Sentiment analysis for brand impact

## 🛠️ Troubleshooting

### Common Issues

1. **AI API Not Responding**
   - Check if AI API server is running on port 8000
   - Verify Anthropic API key is set correctly

2. **No AI Insights Available**
   - Ensure sufficient data exists (minimum 7 days)
   - Check database connection and AI tables

3. **Slow Performance**
   - AI models require computational resources
   - Consider running on more powerful hardware for production

### Logs and Monitoring

- AI API logs: Check FastAPI server output
- Scheduler logs: Monitor `ai_scheduler.py` output
- Database logs: Check SQLite database for AI tables

## 📞 Support

For AI integration support:
- Check logs for error messages
- Verify all dependencies are installed
- Ensure Anthropic API key is valid
- Contact development team for advanced issues

---

**Note**: The AI integration is designed to enhance the existing Waste→Worth platform with intelligent insights while maintaining full compatibility with the current system architecture.
