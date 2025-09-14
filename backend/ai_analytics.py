"""
Advanced AI Analytics Module for Reflourish
Integrates OpenAI and Claude for comprehensive food waste analytics
"""

import requests
import json
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import os

# Import API keys
try:
    from config import OPENAI_API_KEY, ANTHROPIC_API_KEY
except ImportError:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

class AIAnalytics:
    def __init__(self, database_path: str = "packages.db"):
        self.database_path = database_path
        self.openai_key = OPENAI_API_KEY
        self.anthropic_key = ANTHROPIC_API_KEY
    
    def get_package_data(self, store_email: str = None, days: int = 7) -> List[Dict]:
        """Get package data from database"""
        conn = sqlite3.connect(self.database_path)
        cursor = conn.cursor()
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        if store_email:
            cursor.execute('''
                SELECT store_name, store_email, weight_lbs, food_type, status, 
                       created_at, pickup_window_start, pickup_window_end, volunteer_id, 
                       qr_code_data, retail_value, carbon_footprint_kg
                FROM packages 
                WHERE store_email = ? AND created_at >= ? AND created_at <= ?
                ORDER BY created_at DESC
            ''', (store_email, start_date.isoformat(), end_date.isoformat()))
        else:
            cursor.execute('''
                SELECT store_name, store_email, weight_lbs, food_type, status, 
                       created_at, pickup_window_start, pickup_window_end, volunteer_id, 
                       qr_code_data, retail_value, carbon_footprint_kg
                FROM packages 
                WHERE created_at >= ? AND created_at <= ?
                ORDER BY created_at DESC
            ''', (start_date.isoformat(), end_date.isoformat()))
        
        columns = [desc[0] for desc in cursor.description]
        packages = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()
        
        return packages
    
    def calculate_core_metrics(self, packages: List[Dict]) -> Dict[str, Any]:
        """Calculate core analytics metrics"""
        if not packages:
            return {
                'total_waste_lbs': 0,
                'total_packages': 0,
                'completed_packages': 0,
                'completion_rate': 0,
                'food_type_breakdown': {},
                'daily_breakdown': {},
                'financial_impact': 0,
                'carbon_footprint': 0,
                'meals_wasted': 0
            }
        
        # Basic metrics
        total_waste = sum(p['weight_lbs'] for p in packages)
        total_packages = len(packages)
        completed_packages = len([p for p in packages if p['status'] == 'completed'])
        completion_rate = (completed_packages / total_packages * 100) if total_packages > 0 else 0
        
        # Food type breakdown
        food_type_breakdown = {}
        for p in packages:
            food_type = p['food_type']
            if food_type not in food_type_breakdown:
                food_type_breakdown[food_type] = {
                    'count': 0,
                    'weight': 0,
                    'value_lost': 0,
                    'meals_wasted': 0
                }
            food_type_breakdown[food_type]['count'] += 1
            food_type_breakdown[food_type]['weight'] += p['weight_lbs']
            # Estimate value lost (rough calculation)
            food_type_breakdown[food_type]['value_lost'] += p['weight_lbs'] * 3.5  # $3.5 per lb average
            food_type_breakdown[food_type]['meals_wasted'] += p['weight_lbs'] * 2.3  # 2.3 meals per lb
        
        # Daily breakdown
        daily_breakdown = {}
        for p in packages:
            date = p['created_at'][:10]  # YYYY-MM-DD
            if date not in daily_breakdown:
                daily_breakdown[date] = {
                    'packages': 0,
                    'weight': 0,
                    'completed': 0
                }
            daily_breakdown[date]['packages'] += 1
            daily_breakdown[date]['weight'] += p['weight_lbs']
            if p['status'] == 'completed':
                daily_breakdown[date]['completed'] += 1
        
        # Financial and environmental impact
        financial_impact = total_waste * 3.5  # $3.5 per lb average
        carbon_footprint = total_waste * 2.5  # 2.5 kg CO2 per kg food
        meals_wasted = total_waste * 2.3  # 2.3 meals per lb
        
        return {
            'total_waste_lbs': total_waste,
            'total_packages': total_packages,
            'completed_packages': completed_packages,
            'completion_rate': completion_rate,
            'food_type_breakdown': food_type_breakdown,
            'daily_breakdown': daily_breakdown,
            'financial_impact': financial_impact,
            'carbon_footprint': carbon_footprint,
            'meals_wasted': meals_wasted
        }
    
    def generate_executive_summary_openai(self, metrics: Dict[str, Any], store_name: str = "Store") -> str:
        """Generate executive summary using OpenAI"""
        try:
            if not self.openai_key or self.openai_key == "sk-proj-your-openai-key-here":
                return self._fallback_summary(metrics, store_name)
            
            prompt = f"""
            Generate a concise executive summary for {store_name} based on this week's food waste data:
            
            Key Metrics:
            - Total waste: {metrics['total_waste_lbs']:.1f} lbs
            - Packages: {metrics['total_packages']} total, {metrics['completed_packages']} completed
            - Completion rate: {metrics['completion_rate']:.1f}%
            - Financial impact: ${metrics['financial_impact']:.2f}
            - Carbon footprint: {metrics['carbon_footprint']:.1f} kg CO2
            
            Food Type Breakdown:
            {json.dumps(metrics['food_type_breakdown'], indent=2)}
            
            Generate a 2-3 sentence executive summary highlighting:
            1. Key performance changes from previous week
            2. Most significant waste categories
            3. One actionable insight
            
            Be specific and data-driven.
            """
            
            headers = {
                "Authorization": f"Bearer {self.openai_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "You are a food waste reduction analyst. Generate concise, actionable executive summaries."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 200,
                "temperature": 0.7
            }
            
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=15
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content'].strip()
            else:
                print(f"OpenAI API error: {response.status_code}")
                return self._fallback_summary(metrics, store_name)
                
        except Exception as e:
            print(f"OpenAI error: {str(e)}")
            return self._fallback_summary(metrics, store_name)
    
    def generate_detailed_report_claude(self, metrics: Dict[str, Any], packages: List[Dict], store_name: str = "Store") -> str:
        """Generate detailed weekly report using Claude"""
        try:
            if not self.anthropic_key or self.anthropic_key == "sk-ant-your-anthropic-key-here":
                return self._fallback_detailed_report(metrics, store_name)
            
            # Prepare data for Claude
            recent_trends = self._analyze_trends(packages)
            top_waste_categories = sorted(
                metrics['food_type_breakdown'].items(), 
                key=lambda x: x[1]['weight'], 
                reverse=True
            )[:3]
            
            prompt = f"""
            Generate a comprehensive weekly food waste analysis report for {store_name}:
            
            EXECUTIVE SUMMARY:
            - Total waste diverted: {metrics['total_waste_lbs']:.1f} lbs
            - Completion rate: {metrics['completion_rate']:.1f}%
            - Financial impact: ${metrics['financial_impact']:.2f}
            - Environmental impact: {metrics['carbon_footprint']:.1f} kg CO2 prevented
            
            TOP WASTE CATEGORIES:
            {json.dumps(dict(top_waste_categories), indent=2)}
            
            RECENT TRENDS:
            {json.dumps(recent_trends, indent=2)}
            
            Please generate a detailed report including:
            1. Executive Summary with key insights
            2. Performance Analysis (completion rates, trends)
            3. Environmental Impact Assessment
            4. Financial Analysis
            5. Specific Recommendations for improvement
            6. Next Week's Action Items
            
            Format as professional markdown with clear sections and actionable insights.
            """
            
            headers = {
                "x-api-key": self.anthropic_key,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            }
            
            data = {
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 1500,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
            
            response = requests.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['content'][0]['text']
            else:
                print(f"Claude API error: {response.status_code}")
                return self._fallback_detailed_report(metrics, store_name)
                
        except Exception as e:
            print(f"Claude error: {str(e)}")
            return self._fallback_detailed_report(metrics, store_name)
    
    def generate_ai_predictions(self, metrics: Dict[str, Any], packages: List[Dict]) -> Dict[str, Any]:
        """Generate AI predictions for inventory and behavior"""
        try:
            if not self.openai_key or self.openai_key == "sk-proj-your-openai-key-here":
                return self._fallback_predictions(metrics)
            
            # Analyze patterns
            patterns = self._analyze_patterns(packages)
            
            prompt = f"""
            Based on this food waste data, generate predictions and recommendations:
            
            Current Metrics:
            - Total waste: {metrics['total_waste_lbs']:.1f} lbs
            - Completion rate: {metrics['completion_rate']:.1f}%
            - Food type breakdown: {json.dumps(metrics['food_type_breakdown'], indent=2)}
            
            Patterns Analysis:
            {json.dumps(patterns, indent=2)}
            
            Generate predictions for:
            1. Inventory Forecasting: How much of each food type to order next week
            2. Volunteer Behavior: Peak hours and response patterns
            3. Foodbank Needs: Anticipated demand for categories
            4. Optimization Suggestions: Store-level recommendations
            
            Return as JSON with specific, actionable recommendations.
            """
            
            headers = {
                "Authorization": f"Bearer {self.openai_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "You are a Waste→Worth Weekly Analyst. Generate concise, decision-focused reports with strict JSON output."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 1200,
                "temperature": 0.2
            }
            
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=20
            )
            
            if response.status_code == 200:
                result = response.json()
                try:
                    return json.loads(result['choices'][0]['message']['content'])
                except json.JSONDecodeError:
                    return self._fallback_predictions(metrics)
            else:
                return self._fallback_predictions(metrics)
                
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            return self._fallback_predictions(metrics)
    
    def _analyze_trends(self, packages: List[Dict]) -> Dict[str, Any]:
        """Analyze trends in package data"""
        if not packages:
            return {}
        
        # Group by day
        daily_data = {}
        for p in packages:
            date = p['created_at'][:10]
            if date not in daily_data:
                daily_data[date] = {'total': 0, 'completed': 0, 'weight': 0}
            daily_data[date]['total'] += 1
            daily_data[date]['weight'] += p['weight_lbs']
            if p['status'] == 'completed':
                daily_data[date]['completed'] += 1
        
        # Calculate trends
        dates = sorted(daily_data.keys())
        if len(dates) < 2:
            return {'trend': 'insufficient_data'}
        
        recent_avg = sum(daily_data[d]['weight'] for d in dates[-3:]) / min(3, len(dates))
        earlier_avg = sum(daily_data[d]['weight'] for d in dates[:-3]) / max(1, len(dates) - 3) if len(dates) > 3 else recent_avg
        
        trend_direction = 'increasing' if recent_avg > earlier_avg * 1.1 else 'decreasing' if recent_avg < earlier_avg * 0.9 else 'stable'
        
        return {
            'trend': trend_direction,
            'recent_avg_waste': recent_avg,
            'earlier_avg_waste': earlier_avg,
            'daily_data': daily_data
        }
    
    def _analyze_patterns(self, packages: List[Dict]) -> Dict[str, Any]:
        """Analyze patterns in package data"""
        if not packages:
            return {}
        
        # Time patterns
        hour_counts = {}
        for p in packages:
            hour = datetime.fromisoformat(p['created_at'].replace('Z', '+00:00')).hour
            hour_counts[hour] = hour_counts.get(hour, 0) + 1
        
        # Food type patterns
        food_type_counts = {}
        for p in packages:
            food_type = p['food_type']
            food_type_counts[food_type] = food_type_counts.get(food_type, 0) + 1
        
        # Completion patterns
        completion_by_hour = {}
        for p in packages:
            if p['status'] == 'completed':
                hour = datetime.fromisoformat(p['created_at'].replace('Z', '+00:00')).hour
                completion_by_hour[hour] = completion_by_hour.get(hour, 0) + 1
        
        return {
            'peak_hours': sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)[:3],
            'top_food_types': sorted(food_type_counts.items(), key=lambda x: x[1], reverse=True)[:3],
            'completion_by_hour': completion_by_hour
        }
    
    def _fallback_summary(self, metrics: Dict[str, Any], store_name: str) -> str:
        """Fallback executive summary when APIs are unavailable"""
        completion_rate = metrics['completion_rate']
        total_waste = metrics['total_waste_lbs']
        
        if completion_rate > 80:
            performance = "excellent"
        elif completion_rate > 60:
            performance = "good"
        else:
            performance = "needs improvement"
        
        return f"{store_name} showed {performance} performance this week with {total_waste:.1f} lbs of waste diverted and {completion_rate:.1f}% completion rate. Focus on optimizing pickup scheduling to improve efficiency."
    
    def _fallback_detailed_report(self, metrics: Dict[str, Any], store_name: str) -> str:
        """Fallback detailed report when Claude is unavailable"""
        return f"""# Weekly Analysis Report - {store_name}

## Executive Summary
This week, {store_name} diverted {metrics['total_waste_lbs']:.1f} lbs of food waste with a {metrics['completion_rate']:.1f}% completion rate. The financial impact was ${metrics['financial_impact']:.2f} in value saved.

## Key Performance Indicators
- **Total Packages**: {metrics['total_packages']}
- **Completed Packages**: {metrics['completed_packages']}
- **Completion Rate**: {metrics['completion_rate']:.1f}%
- **Total Waste Diverted**: {metrics['total_waste_lbs']:.1f} lbs

## Environmental Impact
- **CO2 Prevented**: {metrics['carbon_footprint']:.1f} kg
- **Meals Provided**: {metrics['meals_wasted']:.0f} meals

## Recommendations
1. Optimize pickup scheduling during peak hours
2. Focus on high-waste food categories
3. Improve volunteer engagement strategies

*Report generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*"""
    
    def _fallback_predictions(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback predictions when OpenAI is unavailable"""
        return {
            "inventory_forecasting": {
                "recommendation": "Reduce inventory by 10-15% based on current waste patterns",
                "high_waste_items": list(metrics['food_type_breakdown'].keys())[:3]
            },
            "volunteer_behavior": {
                "peak_hours": "10 AM - 2 PM, 5 PM - 7 PM",
                "recommendation": "Send notifications 2 hours before peak times"
            },
            "optimization_suggestions": [
                "Implement dynamic pricing for near-expiry items",
                "Create volunteer incentive programs",
                "Optimize pickup routes for efficiency"
            ]
        }

    def generate_structured_report(self, core_metrics: Dict, packages: List[Dict], 
                                 store_name: str, period_start: str, period_end: str) -> Dict:
        """Generate structured JSON report using the new format"""
        try:
            # Calculate additional metrics
            total_packages = len(packages)
            completed_packages = len([p for p in packages if p.get('status') == 'completed'])
            completion_rate = (completed_packages / total_packages) if total_packages > 0 else 0
            
            waste_generated = sum(p.get('weight_lbs', 0) for p in packages)
            waste_diverted = sum(p.get('weight_lbs', 0) for p in packages if p.get('status') == 'completed')
            financial_impact = sum(p.get('retail_value', 0) for p in packages)
            meals_lost = waste_generated * 2.3  # meals per kg
            co2e_kg = waste_generated * 1.1  # kg CO2 per kg food
            
            # Category breakdown
            category_breakdown = {}
            for package in packages:
                food_type = package.get('food_type', 'Unknown')
                weight = package.get('weight_lbs', 0)
                if food_type in category_breakdown:
                    category_breakdown[food_type] += weight
                else:
                    category_breakdown[food_type] = weight
            
            total_waste = sum(category_breakdown.values())
            category_breakdown_list = [
                {
                    'category': category,
                    'waste_lbs': weight,
                    'share': weight / total_waste if total_waste > 0 else 0
                }
                for category, weight in category_breakdown.items()
            ]
            
            # Generate AI analysis using the new structured prompt
            prompt = f"""ROLE: Waste→Worth Weekly Analyst
STYLE: concise, decision-focused, no fluff, no markdown.
GOAL: Turn raw weekly metrics into (1) a plain-text executive summary and (2) a strict JSON payload the UI can render.

INSTRUCTIONS
1) Never use markdown, bullets, or headings in the plain_text_report. Keep it to 3–6 crisp sentences with specific, measurable actions.
2) Use the JSON schema below exactly. If a field is unknown, set it to null and explain briefly in data_quality_notes.
3) Recommendations must include expected_impact and how_to_measure. Forecast must list a range and explicit assumptions.
4) Be numerically consistent. Show rates as decimals (0–1). Round weights to 1 decimal, money to 2 decimals, CO2e to 1 decimal.
5) Guardrails: do not invent stores, dates, or categories not present in input. If sample size is low, lower confidence and say why.

INPUT
store_name: {store_name}
period_start: {period_start}
period_end: {period_end}
metrics_current_week: {{
  "waste_generated_lbs": {waste_generated},
  "waste_diverted_lbs": {waste_diverted},
  "financial_impact_usd": {financial_impact},
  "meals_lost_est": {meals_lost},
  "co2e_kg": {co2e_kg},
  "total_packages": {total_packages},
  "completed_packages": {completed_packages},
  "category_breakdown": {json.dumps(category_breakdown_list)}
}}
metrics_last_week: null
pickup_log_sample: {json.dumps(packages[:5], default=str)}
photos_with_estimates: []
constraints_notes: "Single store analysis"

OUTPUT REQUIREMENTS
- Return only the JSON object.
- No markdown, no code fences, no commentary.

SCHEMA (return exactly one JSON object)
{{
  "store_name": "string",
  "period_start": "YYYY-MM-DD",
  "period_end": "YYYY-MM-DD",
  "kpis": {{
    "total_packages": number,
    "completed_packages": number,
    "completion_rate": number,
    "waste_generated_lbs": number,
    "waste_diverted_lbs": number,
    "financial_impact_usd": number,
    "meals_lost_est": number,
    "co2e_kg": number
  }},
  "category_breakdown": [
    {{ "category": "string", "waste_lbs": number, "share": number }}
  ],
  "root_causes_ranked": ["string", "string", "string"],
  "recommendations": [
    {{
      "title": "string",
      "priority": "high" | "medium" | "low",
      "rationale": "string",
      "expected_impact": "string",
      "how_to_measure": "string",
      "owner": "string|null",
      "eta_days": "number|null"
    }}
  ],
  "forecast": {{
    "waste_next_week_lbs_low": number,
    "waste_next_week_lbs_high": number,
    "assumptions": "string"
  }},
  "confidence": number,
  "data_quality_notes": "string",
  "plain_text_report": "string"
}}"""
            
            response = self._call_openai_api(prompt)
            
            if response:
                try:
                    return json.loads(response)
                except json.JSONDecodeError:
                    # Fallback to basic structure if JSON parsing fails
                    return self._create_fallback_structured_report(
                        store_name, period_start, period_end, core_metrics, 
                        category_breakdown_list, total_packages, completed_packages, 
                        completion_rate, waste_generated, waste_diverted, 
                        financial_impact, meals_lost, co2e_kg
                    )
            
            return self._create_fallback_structured_report(
                store_name, period_start, period_end, core_metrics, 
                category_breakdown_list, total_packages, completed_packages, 
                completion_rate, waste_generated, waste_diverted, 
                financial_impact, meals_lost, co2e_kg
            )
            
        except Exception as e:
            print(f"Error generating structured report: {e}")
            return self._create_fallback_structured_report(
                store_name, period_start, period_end, core_metrics, 
                category_breakdown_list, total_packages, completed_packages, 
                completion_rate, waste_generated, waste_diverted, 
                financial_impact, meals_lost, co2e_kg
            )

    def _create_fallback_structured_report(self, store_name: str, period_start: str, period_end: str,
                                         core_metrics: Dict, category_breakdown: List, 
                                         total_packages: int, completed_packages: int,
                                         completion_rate: float, waste_generated: float,
                                         waste_diverted: float, financial_impact: float,
                                         meals_lost: float, co2e_kg: float) -> Dict:
        """Create a fallback structured report when AI generation fails"""
        return {
            "store_name": store_name,
            "period_start": period_start,
            "period_end": period_end,
            "kpis": {
                "total_packages": total_packages,
                "completed_packages": completed_packages,
                "completion_rate": completion_rate,
                "waste_generated_lbs": waste_generated,
                "waste_diverted_lbs": waste_diverted,
                "financial_impact_usd": financial_impact,
                "meals_lost_est": meals_lost,
                "co2e_kg": co2e_kg
            },
            "category_breakdown": category_breakdown,
            "root_causes_ranked": [
                "Insufficient volunteer coverage during peak hours",
                "Late-day overproduction of perishable items",
                "Lack of real-time inventory management"
            ],
            "recommendations": [
                {
                    "title": "Optimize pickup scheduling during peak hours",
                    "priority": "high",
                    "rationale": "Low completion rate indicates scheduling issues",
                    "expected_impact": "Increase completion rate by 20-30%",
                    "how_to_measure": "Track completion rate week over week",
                    "owner": "Operations Manager",
                    "eta_days": 7
                },
                {
                    "title": "Implement waste reduction protocols",
                    "priority": "medium",
                    "rationale": "High waste generation indicates overproduction",
                    "expected_impact": "Reduce waste by 15-25%",
                    "how_to_measure": "Monitor waste generation daily",
                    "owner": "Kitchen Lead",
                    "eta_days": 14
                }
            ],
            "forecast": {
                "waste_next_week_lbs_low": waste_generated * 0.8,
                "waste_next_week_lbs_high": waste_generated * 1.2,
                "assumptions": "Current patterns continue with minor improvements"
            },
            "confidence": 0.6,
            "data_quality_notes": "Limited historical data; using current week patterns for forecasting",
            "plain_text_report": f"Total food waste was {waste_generated:.1f} lbs, driving an estimated financial loss of ${financial_impact:.2f} and {co2e_kg:.1f} kg CO₂e. Completion rate was {completion_rate:.1%} with {completed_packages} of {total_packages} packages successfully picked up. To improve next week, focus on optimizing pickup scheduling and reducing overproduction."
        }
