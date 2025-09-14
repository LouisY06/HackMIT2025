"""
AI Models for Food Waste Analytics and Predictions
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from prophet import Prophet
import sqlite3
import json
import os
from typing import Dict, List, Tuple, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WasteAnalytics:
    """Core analytics engine for food waste data"""
    
    def __init__(self, database_path: str = "packages.db"):
        self.db_path = database_path
        self.scaler = StandardScaler()
        
    def get_historical_data(self, days: int = 30) -> pd.DataFrame:
        """Fetch historical package data for analysis"""
        try:
            conn = sqlite3.connect(self.db_path)
            
            query = """
            SELECT 
                store_name,
                store_email,
                weight_lbs,
                food_type,
                created_at,
                pickup_completed_at,
                status,
                volunteer_id,
                EXTRACT(DOW FROM created_at) as day_of_week,
                EXTRACT(HOUR FROM created_at) as hour_of_day,
                EXTRACT(MONTH FROM created_at) as month
            FROM packages 
            WHERE created_at >= datetime('now', '-{} days')
            ORDER BY created_at DESC
            """.format(days)
            
            df = pd.read_sql_query(query, conn)
            conn.close()
            
            if df.empty:
                logger.warning("No historical data found")
                return pd.DataFrame()
                
            # Convert datetime columns
            df['created_at'] = pd.to_datetime(df['created_at'])
            df['pickup_completed_at'] = pd.to_datetime(df['pickup_completed_at'])
            
            # Calculate time to pickup
            df['pickup_duration_hours'] = (
                df['pickup_completed_at'] - df['created_at']
            ).dt.total_seconds() / 3600
            
            return df
            
        except Exception as e:
            logger.error(f"Error fetching historical data: {e}")
            return pd.DataFrame()
    
    def calculate_waste_trends(self, df: pd.DataFrame) -> Dict:
        """Analyze waste patterns and trends"""
        if df.empty:
            return {}
            
        trends = {
            'total_waste_lbs': df['weight_lbs'].sum(),
            'avg_package_weight': df['weight_lbs'].mean(),
            'total_packages': len(df),
            'completion_rate': (df['status'] == 'completed').mean() * 100,
            'avg_pickup_time_hours': df['pickup_duration_hours'].mean(),
        }
        
        # Food type breakdown
        food_type_analysis = df.groupby('food_type').agg({
            'weight_lbs': ['sum', 'mean', 'count'],
            'pickup_duration_hours': 'mean'
        }).round(2)
        
        trends['food_type_breakdown'] = food_type_analysis.to_dict()
        
        # Store analysis
        store_analysis = df.groupby('store_name').agg({
            'weight_lbs': ['sum', 'mean', 'count'],
            'pickup_duration_hours': 'mean',
            'status': lambda x: (x == 'completed').sum()
        }).round(2)
        
        trends['store_breakdown'] = store_analysis.to_dict()
        
        # Time-based patterns
        trends['hourly_patterns'] = df.groupby('hour_of_day')['weight_lbs'].sum().to_dict()
        trends['daily_patterns'] = df.groupby('day_of_week')['weight_lbs'].sum().to_dict()
        
        return trends
    
    def calculate_carbon_footprint(self, waste_lbs: float) -> Dict:
        """Calculate carbon footprint impact using EPA conversion factors"""
        # EPA conversion factors (kg CO2e per kg food waste)
        conversion_factors = {
            'meat': 6.5,      # Highest methane potential
            'dairy': 4.5,
            'produce': 2.8,
            'bread': 3.2,
            'prepared_foods': 4.1,
            'default': 3.5    # Average across food types
        }
        
        # Convert lbs to kg
        waste_kg = waste_lbs * 0.453592
        
        # Calculate CO2e (conservative estimate using average factor)
        co2e_kg = waste_kg * conversion_factors['default']
        co2e_lbs = co2e_kg * 2.20462
        
        # Calculate meals equivalent (1 lb of food ≈ 1.2 meals)
        meals_provided = waste_lbs * 1.2
        
        return {
            'co2e_prevented_kg': round(co2e_kg, 2),
            'co2e_prevented_lbs': round(co2e_lbs, 2),
            'meals_provided': round(meals_provided, 1),
            'families_helped': round(meals_provided / 4, 1)  # 4 meals per family
        }

class WastePredictor:
    """Predictive models for waste forecasting and optimization"""
    
    def __init__(self):
        self.inventory_model = None
        self.volunteer_model = None
        self.demand_model = None
        
    def prepare_features(self, df: pd.DataFrame) -> np.ndarray:
        """Prepare features for ML models"""
        if df.empty:
            return np.array([])
            
        features = []
        for _, row in df.iterrows():
            feature_vector = [
                row['day_of_week'],
                row['hour_of_day'],
                row['month'],
                row['weight_lbs'],
                1 if row['food_type'] == 'meat' else 0,
                1 if row['food_type'] == 'dairy' else 0,
                1 if row['food_type'] == 'produce' else 0,
                1 if row['food_type'] == 'bread' else 0,
                1 if row['food_type'] == 'prepared_foods' else 0,
            ]
            features.append(feature_vector)
            
        return np.array(features)
    
    def train_inventory_forecasting(self, df: pd.DataFrame) -> bool:
        """Train model to predict next week's waste by food type"""
        try:
            if df.empty or len(df) < 10:
                logger.warning("Insufficient data for training inventory model")
                return False
                
            # Group by food type and create time series
            food_types = df['food_type'].unique()
            predictions = {}
            
            for food_type in food_types:
                food_data = df[df['food_type'] == food_type].copy()
                food_data = food_data.groupby(food_data['created_at'].dt.date)['weight_lbs'].sum().reset_index()
                
                if len(food_data) >= 7:  # Need at least a week of data
                    # Use Prophet for time series forecasting
                    prophet_df = pd.DataFrame({
                        'ds': pd.to_datetime(food_data['created_at']),
                        'y': food_data['weight_lbs']
                    })
                    
                    model = Prophet(
                        yearly_seasonality=False,
                        weekly_seasonality=True,
                        daily_seasonality=False
                    )
                    model.fit(prophet_df)
                    
                    # Forecast next 7 days
                    future = model.make_future_dataframe(periods=7)
                    forecast = model.predict(future)
                    
                    next_week_prediction = forecast.tail(7)['yhat'].sum()
                    predictions[food_type] = max(0, round(next_week_prediction, 1))
                    
            self.inventory_predictions = predictions
            return True
            
        except Exception as e:
            logger.error(f"Error training inventory model: {e}")
            return False
    
    def train_volunteer_optimization(self, df: pd.DataFrame) -> bool:
        """Train model to optimize volunteer-store matching"""
        try:
            if df.empty:
                return False
                
            # Features: store characteristics, time patterns, volunteer performance
            completed_packages = df[df['status'] == 'completed'].copy()
            
            if len(completed_packages) < 5:
                logger.warning("Insufficient completed packages for volunteer optimization")
                return False
            
            # Analyze volunteer performance patterns
            volunteer_performance = completed_packages.groupby('volunteer_id').agg({
                'pickup_duration_hours': 'mean',
                'weight_lbs': 'sum',
                'store_name': 'count'
            }).reset_index()
            
            volunteer_performance.columns = ['volunteer_id', 'avg_pickup_time', 'total_weight', 'total_pickups']
            
            # Calculate efficiency score (lower pickup time = higher efficiency)
            volunteer_performance['efficiency_score'] = (
                1 / (volunteer_performance['avg_pickup_time'] + 0.1)
            ) * volunteer_performance['total_weight']
            
            self.volunteer_efficiency = volunteer_performance.to_dict('records')
            return True
            
        except Exception as e:
            logger.error(f"Error training volunteer model: {e}")
            return False
    
    def get_optimization_recommendations(self) -> Dict:
        """Generate optimization recommendations based on trained models"""
        recommendations = {
            'inventory_reductions': {},
            'volunteer_assignments': [],
            'peak_hours': [],
            'high_risk_stores': []
        }
        
        # Inventory reduction recommendations
        if hasattr(self, 'inventory_predictions'):
            for food_type, predicted_waste in self.inventory_predictions.items():
                if predicted_waste > 20:  # High waste threshold
                    reduction_percent = min(25, predicted_waste * 0.15)  # 15% reduction, max 25%
                    recommendations['inventory_reductions'][food_type] = {
                        'current_waste_lbs': predicted_waste,
                        'suggested_reduction_percent': round(reduction_percent, 1),
                        'potential_savings_lbs': round(predicted_waste * reduction_percent / 100, 1)
                    }
        
        # Volunteer optimization recommendations
        if hasattr(self, 'volunteer_efficiency'):
            top_volunteers = sorted(
                self.volunteer_efficiency, 
                key=lambda x: x['efficiency_score'], 
                reverse=True
            )[:5]
            
            recommendations['top_volunteers'] = [
                {
                    'volunteer_id': v['volunteer_id'],
                    'efficiency_score': round(v['efficiency_score'], 2),
                    'avg_pickup_time': round(v['avg_pickup_time'], 1),
                    'total_impact': round(v['total_weight'], 1)
                }
                for v in top_volunteers
            ]
        
        return recommendations

class AIInsightsGenerator:
    """Generate natural language insights using Anthropic API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        
    def generate_weekly_report(self, trends: Dict, predictions: Dict, recommendations: Dict) -> str:
        """Generate a comprehensive weekly AI report"""
        try:
            # Try to use Anthropic API if available
            if self.api_key and self.api_key.startswith('sk-ant-'):
                return self._generate_with_anthropic(trends, predictions, recommendations)
            else:
                return self._generate_structured_report(trends, predictions, recommendations)
                
        except Exception as e:
            logger.error(f"Error generating AI report: {e}")
            return self._generate_structured_report(trends, predictions, recommendations)
    
    def _generate_with_anthropic(self, trends: Dict, predictions: Dict, recommendations: Dict) -> str:
        """Generate report using Anthropic Claude API"""
        try:
            import anthropic
            
            client = anthropic.Anthropic(api_key=self.api_key)
            
            prompt = f"""
            Generate a comprehensive weekly AI report for a food waste reduction platform based on the following data:

            Trends: {trends}
            Predictions: {predictions}
            Recommendations: {recommendations}

            Please provide:
            1. Executive summary of key metrics
            2. Detailed analysis of waste patterns
            3. Specific actionable recommendations
            4. Environmental and financial impact insights
            5. Next week's optimization opportunities

            Format the response in clear, actionable language suitable for store managers and volunteers.
            """
            
            response = client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=2000,
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            
            return response.content[0].text
            
        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            return self._generate_structured_report(trends, predictions, recommendations)
    
    def _generate_structured_report(self, trends: Dict, predictions: Dict, recommendations: Dict) -> str:
        """Generate structured report without API"""
        report = f"""
# Weekly AI-Generated Report

## 📊 Key Metrics
- **Total Waste Diverted**: {trends.get('total_waste_lbs', 0):.1f} lbs
- **Packages Processed**: {trends.get('total_packages', 0)}
- **Completion Rate**: {trends.get('completion_rate', 0):.1f}%
- **Average Pickup Time**: {trends.get('avg_pickup_time_hours', 0):.1f} hours

## 🔍 Waste Trends Analysis
- **Most Common Food Type**: {max(trends.get('food_type_breakdown', {}), key=trends.get('food_type_breakdown', {}).get, default='N/A')}
- **Peak Waste Hours**: {sorted(trends.get('hourly_patterns', {}).items(), key=lambda x: x[1], reverse=True)[:3]}

## 🎯 AI Recommendations
### Inventory Optimization
"""
        
        for food_type, rec in recommendations.get('inventory_reductions', {}).items():
            report += f"- **{food_type.title()}**: Reduce ordering by {rec['suggested_reduction_percent']}% (save {rec['potential_savings_lbs']} lbs)\n"
        
        report += """
### Volunteer Performance
"""
        
        for volunteer in recommendations.get('top_volunteers', [])[:3]:
            report += f"- **Volunteer {volunteer['volunteer_id'][:8]}**: {volunteer['avg_pickup_time']}h avg pickup, {volunteer['total_impact']} lbs saved\n"
        
        return report

def calculate_financial_impact(waste_lbs: float, food_type: str) -> Dict:
    """Calculate financial impact of waste reduction"""
    # Retail value estimates per pound by food type
    retail_values = {
        'meat': 8.50,
        'dairy': 3.20,
        'produce': 2.80,
        'bread': 1.50,
        'prepared_foods': 6.00,
        'default': 3.50
    }
    
    value_per_lb = retail_values.get(food_type, retail_values['default'])
    total_value = waste_lbs * value_per_lb
    
    # Waste disposal cost savings (typically $0.10-0.50 per lb)
    disposal_cost_savings = waste_lbs * 0.30
    
    return {
        'retail_value_saved': round(total_value, 2),
        'disposal_cost_savings': round(disposal_cost_savings, 2),
        'total_financial_impact': round(total_value + disposal_cost_savings, 2)
    }
