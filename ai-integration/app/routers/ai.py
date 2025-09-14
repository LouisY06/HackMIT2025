from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date, timedelta, datetime
from typing import Optional, Dict, Any
import json
import sqlite3
from ..db import get_db
from ..models import *
from ..schemas import *

router = APIRouter(prefix="/api/ai", tags=["ai"])

def get_sqlite_connection():
    """Get SQLite connection to the main database"""
    return sqlite3.connect('../backend/packages.db')

@router.get("/global-metrics")
def get_global_metrics(days: int = Query(30, description="Number of days to analyze")):
    """Get platform-wide AI metrics and insights"""
    try:
        conn = get_sqlite_connection()
        cursor = conn.cursor()
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Get packages data
        cursor.execute('''
            SELECT 
                store_name, store_email, weight_lbs, food_type, 
                status, created_at, volunteer_id, pickup_completed_at
            FROM packages 
            WHERE created_at >= ? AND created_at <= ?
        ''', (start_date.isoformat(), end_date.isoformat()))
        
        packages = cursor.fetchall()
        conn.close()
        
        if not packages:
            return {
                "success": True,
                "metrics": {
                    "message": "No data available for the specified period",
                    "period_days": days,
                    "total_waste_diverted_lbs": 0,
                    "total_packages": 0,
                    "active_stores": 0,
                    "active_volunteers": 0,
                    "completion_rate": 0,
                    "avg_pickup_time_hours": 0,
                    "environmental_impact": {
                        "co2e_prevented_lbs": 0,
                        "meals_provided": 0,
                        "families_helped": 0
                    },
                    "top_waste_food_types": {},
                    "top_performing_stores": {},
                    "platform_efficiency_score": 0
                }
            }
        
        # Calculate metrics
        total_waste = sum(p[2] for p in packages)  # weight_lbs
        total_packages = len(packages)
        completed_packages = len([p for p in packages if p[4] == 'completed'])  # status
        completion_rate = (completed_packages / total_packages * 100) if total_packages > 0 else 0
        
        # Get unique stores and volunteers
        unique_stores = set(p[1] for p in packages)  # store_email
        unique_volunteers = set(p[6] for p in packages if p[6])  # volunteer_id
        
        # Calculate average pickup time (mock calculation)
        avg_pickup_time = 2.5  # hours
        
        # Environmental impact calculations
        co2e_prevented = total_waste * 2.5  # kg CO2 per kg food
        meals_provided = total_waste * 2.3  # meals per kg
        families_helped = completed_packages * 1.2  # families per pickup
        
        # Food type breakdown
        food_types = {}
        for package in packages:
            food_type = package[3]  # food_type
            food_types[food_type] = food_types.get(food_type, 0) + 1
        
        # Top performing stores
        store_performance = {}
        for package in packages:
            store_name = package[0]  # store_name
            weight = package[2]  # weight_lbs
            store_performance[store_name] = store_performance.get(store_name, 0) + weight
        
        # Sort and get top 5
        top_stores = dict(sorted(store_performance.items(), key=lambda x: x[1], reverse=True)[:5])
        top_food_types = dict(sorted(food_types.items(), key=lambda x: x[1], reverse=True)[:5])
        
        # Platform efficiency score
        platform_efficiency = min(100, completion_rate * 0.8 + (100 - min(avg_pickup_time * 5, 100)) * 0.2)
        
        metrics = {
            "period_days": days,
            "total_waste_diverted_lbs": round(total_waste, 1),
            "total_packages": total_packages,
            "active_stores": len(unique_stores),
            "active_volunteers": len(unique_volunteers),
            "completion_rate": round(completion_rate, 1),
            "avg_pickup_time_hours": round(avg_pickup_time, 1),
            "environmental_impact": {
                "co2e_prevented_lbs": round(co2e_prevented, 1),
                "meals_provided": round(meals_provided, 0),
                "families_helped": round(families_helped, 0)
            },
            "top_waste_food_types": top_food_types,
            "top_performing_stores": top_stores,
            "platform_efficiency_score": round(platform_efficiency, 1)
        }
        
        return {
            "success": True,
            "metrics": metrics,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/store-insights/{store_email}")
def get_store_insights(store_email: str, days: int = Query(30, description="Number of days to analyze")):
    """Get AI insights for a specific store"""
    try:
        conn = get_sqlite_connection()
        cursor = conn.cursor()
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Get store packages
        cursor.execute('''
            SELECT 
                store_name, weight_lbs, food_type, status, 
                created_at, volunteer_id, pickup_completed_at
            FROM packages 
            WHERE store_email = ? AND created_at >= ? AND created_at <= ?
        ''', (store_email, start_date.isoformat(), end_date.isoformat()))
        
        packages = cursor.fetchall()
        conn.close()
        
        if not packages:
            return {
                "success": True,
                "insights": {
                    "message": "No data available for this store",
                    "store_email": store_email,
                    "period_days": days,
                    "total_waste_lbs": 0,
                    "total_packages": 0,
                    "completion_rate": 0,
                    "avg_pickup_time_hours": 0,
                    "financial_impact": {
                        "retail_value_saved": 0,
                        "disposal_cost_savings": 0,
                        "total_financial_impact": 0
                    },
                    "environmental_impact": {
                        "co2e_prevented_kg": 0,
                        "co2e_prevented_lbs": 0,
                        "meals_provided": 0,
                        "families_helped": 0
                    },
                    "food_type_breakdown": {},
                    "performance_score": 0
                }
            }
        
        # Calculate metrics
        total_waste = sum(p[1] for p in packages)  # weight_lbs
        total_packages = len(packages)
        completed_packages = len([p for p in packages if p[3] == 'completed'])  # status
        completion_rate = (completed_packages / total_packages * 100) if total_packages > 0 else 0
        
        # Calculate average pickup time (mock calculation)
        avg_pickup_time = 2.0  # hours
        
        # Financial impact calculations
        retail_value_saved = total_waste * 3.5  # $3.5 per lb
        disposal_cost_savings = total_waste * 0.15  # $0.15 per lb disposal cost
        total_financial_impact = retail_value_saved + disposal_cost_savings
        
        # Environmental impact
        co2e_prevented_kg = total_waste * 1.13  # kg CO2 per kg food
        co2e_prevented_lbs = co2e_prevented_kg * 2.205  # convert to lbs
        meals_provided = total_waste * 2.3  # meals per kg
        families_helped = completed_packages * 1.2  # families per pickup
        
        # Food type breakdown
        food_type_breakdown = {}
        for package in packages:
            food_type = package[2]  # food_type
            weight = package[1]  # weight_lbs
            if food_type not in food_type_breakdown:
                food_type_breakdown[food_type] = {"weight_lbs": 0, "count": 0}
            food_type_breakdown[food_type]["weight_lbs"] += weight
            food_type_breakdown[food_type]["count"] += 1
        
        # Performance score
        performance_score = min(100, completion_rate * 0.7 + (100 - min(avg_pickup_time * 10, 100)) * 0.3)
        
        insights = {
            "store_email": store_email,
            "period_days": days,
            "total_waste_lbs": round(total_waste, 1),
            "total_packages": total_packages,
            "completion_rate": round(completion_rate, 1),
            "avg_pickup_time_hours": round(avg_pickup_time, 1),
            "financial_impact": {
                "retail_value_saved": round(retail_value_saved, 2),
                "disposal_cost_savings": round(disposal_cost_savings, 2),
                "total_financial_impact": round(total_financial_impact, 2)
            },
            "environmental_impact": {
                "co2e_prevented_kg": round(co2e_prevented_kg, 1),
                "co2e_prevented_lbs": round(co2e_prevented_lbs, 1),
                "meals_provided": round(meals_provided, 0),
                "families_helped": round(families_helped, 0)
            },
            "food_type_breakdown": food_type_breakdown,
            "performance_score": round(performance_score, 1)
        }
        
        return {
            "success": True,
            "insights": insights,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/volunteer-insights/{volunteer_id}")
def get_volunteer_insights(volunteer_id: str, days: int = Query(30, description="Number of days to analyze")):
    """Get AI-powered insights for a specific volunteer"""
    try:
        conn = get_sqlite_connection()
        cursor = conn.cursor()
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Get volunteer packages
        cursor.execute('''
            SELECT 
                store_name, weight_lbs, food_type, status, 
                created_at, pickup_completed_at
            FROM packages 
            WHERE volunteer_id = ? AND created_at >= ? AND created_at <= ?
        ''', (volunteer_id, start_date.isoformat(), end_date.isoformat()))
        
        packages = cursor.fetchall()
        conn.close()
        
        if not packages:
            return {
                "success": True,
                "insights": {
                    "volunteer_id": volunteer_id,
                    "period_days": days,
                    "total_pickups": 0,
                    "total_weight_lbs": 0,
                    "avg_pickup_time_hours": 0,
                    "efficiency_rating": "Beginner",
                    "performance_score": 0,
                    "preferred_food_types": {},
                    "preferred_stores": {},
                    "environmental_impact": {
                        "co2e_prevented_lbs": 0,
                        "co2_prevented_kg": 0,
                        "meals_provided": 0,
                        "families_helped": 0
                    },
                    "achievement_progress": {
                        "current_level": "New Volunteer",
                        "next_level": "Community Starter",
                        "progress_percentage": 0
                    }
                }
            }
        
        # Calculate metrics
        total_pickups = len(packages)
        total_weight = sum(p[1] for p in packages)  # weight_lbs
        avg_pickup_time = 1.5  # hours (mock calculation)
        
        # Calculate efficiency rating
        if total_pickups >= 20:
            efficiency_rating = "High"
        elif total_pickups >= 10:
            efficiency_rating = "Medium"
        else:
            efficiency_rating = "Low"
        
        # Performance score
        performance_score = min(100, (total_pickups * 5) + (total_weight * 0.5))
        
        # Preferred food types and stores
        preferred_food_types = {}
        preferred_stores = {}
        
        for package in packages:
            food_type = package[2]  # food_type
            store_name = package[0]  # store_name
            
            preferred_food_types[food_type] = preferred_food_types.get(food_type, 0) + 1
            preferred_stores[store_name] = preferred_stores.get(store_name, 0) + 1
        
        # Environmental impact
        co2e_prevented_lbs = total_weight * 2.5  # kg CO2 per kg food
        co2_prevented_kg = co2e_prevented_lbs * 0.453592  # convert to kg
        meals_provided = total_weight * 2.3  # meals per kg
        families_helped = total_pickups * 1.2  # families per pickup
        
        # Achievement progress
        if total_pickups >= 50:
            current_level = "Eco Champion"
            next_level = "Master Eco Champion"
            progress_percentage = min(100, ((total_pickups - 50) / 25) * 100)
        elif total_pickups >= 25:
            current_level = "Waste Warrior"
            next_level = "Eco Champion"
            progress_percentage = min(100, ((total_pickups - 25) / 25) * 100)
        elif total_pickups >= 10:
            current_level = "Green Helper"
            next_level = "Waste Warrior"
            progress_percentage = min(100, ((total_pickups - 10) / 15) * 100)
        elif total_pickups >= 5:
            current_level = "Community Starter"
            next_level = "Green Helper"
            progress_percentage = min(100, ((total_pickups - 5) / 5) * 100)
        else:
            current_level = "New Volunteer"
            next_level = "Community Starter"
            progress_percentage = min(100, (total_pickups / 5) * 100)
        
        insights = {
            "volunteer_id": volunteer_id,
            "period_days": days,
            "total_pickups": total_pickups,
            "total_weight_lbs": round(total_weight, 1),
            "avg_pickup_time_hours": round(avg_pickup_time, 1),
            "efficiency_rating": efficiency_rating,
            "performance_score": round(performance_score, 1),
            "preferred_food_types": preferred_food_types,
            "preferred_stores": preferred_stores,
            "environmental_impact": {
                "co2e_prevented_lbs": round(co2e_prevented_lbs, 1),
                "co2_prevented_kg": round(co2_prevented_kg, 1),
                "meals_provided": round(meals_provided, 0),
                "families_helped": round(families_helped, 0)
            },
            "achievement_progress": {
                "current_level": current_level,
                "next_level": next_level,
                "progress_percentage": round(progress_percentage, 1)
            }
        }
        
        return {
            "success": True,
            "insights": insights,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/heatmap-data")
def get_heatmap_data(days: int = Query(30, description="Number of days to analyze")):
    """Get data for waste heatmap visualization"""
    try:
        conn = get_sqlite_connection()
        cursor = conn.cursor()
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Get packages data grouped by store
        cursor.execute('''
            SELECT 
                store_name, weight_lbs, status, created_at
            FROM packages 
            WHERE created_at >= ? AND created_at <= ?
        ''', (start_date.isoformat(), end_date.isoformat()))
        
        packages = cursor.fetchall()
        conn.close()
        
        if not packages:
            return {
                "success": True,
                "heatmap_data": []
            }
        
        # Group by store and calculate metrics
        store_metrics = {}
        for package in packages:
            store_name = package[0]
            weight = package[1]
            status = package[2]
            
            if store_name not in store_metrics:
                store_metrics[store_name] = {
                    "total_waste_lbs": 0,
                    "package_count": 0,
                    "completed_count": 0
                }
            
            store_metrics[store_name]["total_waste_lbs"] += weight
            store_metrics[store_name]["package_count"] += 1
            if status == "completed":
                store_metrics[store_name]["completed_count"] += 1
        
        # Create heatmap data
        heatmap_data = []
        for store_name, metrics in store_metrics.items():
            completion_rate = (metrics["completed_count"] / metrics["package_count"] * 100) if metrics["package_count"] > 0 else 0
            avg_waste = metrics["total_waste_lbs"] / metrics["package_count"] if metrics["package_count"] > 0 else 0
            
            # Determine risk level based on total waste
            if metrics["total_waste_lbs"] > 100:
                waste_risk_level = "High"
            elif metrics["total_waste_lbs"] > 50:
                waste_risk_level = "Medium"
            else:
                waste_risk_level = "Low"
            
            heatmap_data.append({
                "store_name": store_name,
                "total_waste_lbs": round(metrics["total_waste_lbs"], 1),
                "avg_waste_lbs": round(avg_waste, 1),
                "package_count": metrics["package_count"],
                "avg_pickup_time_hours": 2.0,  # mock calculation
                "completion_rate": round(completion_rate, 1),
                "waste_risk_level": waste_risk_level
            })
        
        # Sort by total waste descending
        heatmap_data.sort(key=lambda x: x["total_waste_lbs"], reverse=True)
        
        return {
            "success": True,
            "heatmap_data": heatmap_data,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/weekly-report")
def generate_weekly_report(request: Dict[str, Any]):
    """Generate AI-powered weekly report"""
    try:
        store_email = request.get("store_email")
        days = request.get("days", 7)
        
        # Mock AI report generation
        report = f"""## Weekly Analysis Report

### Store Performance Summary
Your store has shown consistent performance this week with {days} days of data.

### Key Findings
- **Waste Reduction**: Your store has successfully diverted food waste from landfills
- **Volunteer Engagement**: Strong volunteer participation in pickup activities
- **Environmental Impact**: Significant CO2 emissions prevented through food recovery

### Recommendations
1. **Optimize Pickup Times**: Consider scheduling pickups during off-peak hours
2. **Expand Food Types**: Add more variety to increase volunteer engagement
3. **Monitor Trends**: Track weekly patterns to optimize package creation timing

### Next Steps
- Continue monitoring waste patterns
- Engage with volunteers for feedback
- Consider expanding to more food categories

*Report generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*"""
        
        return {
            "success": True,
            "report": report,
            "trends": {
                "waste_trend": "stable",
                "volunteer_engagement": "high",
                "efficiency": "improving"
            },
            "recommendations": [
                "Optimize pickup scheduling",
                "Expand food type variety",
                "Monitor weekly patterns"
            ],
            "environmental_impact": {
                "co2_prevented": "Significant reduction in carbon footprint",
                "waste_diverted": "Food waste successfully diverted from landfills"
            },
            "period_days": days,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
