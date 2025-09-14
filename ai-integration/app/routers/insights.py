from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import Optional
from ..db import get_db
from ..models import MetricsDaily
from ..schemas import DailyMetricsRequest, MetricsDailyResponse

router = APIRouter(prefix="/metrics", tags=["insights"])

@router.get("/daily", response_model=list[MetricsDailyResponse])
def get_daily_metrics(
    store_id: Optional[int] = Query(None),
    start: date = Query(...),
    end: date = Query(...),
    db: Session = Depends(get_db)
):
    """Get daily metrics for dashboard."""
    query = db.query(MetricsDaily).filter(
        MetricsDaily.date >= start,
        MetricsDaily.date <= end
    )
    
    if store_id:
        query = query.filter(MetricsDaily.store_id == store_id)
    
    return query.order_by(MetricsDaily.date.desc()).all()

@router.get("/weekly/{store_id}")
def get_weekly_insights(store_id: int, db: Session = Depends(get_db)):
    """Get weekly insights and recommendations for a store."""
    end = date.today()
    start = end - timedelta(days=6)
    
    # Get metrics for the week
    metrics = db.query(MetricsDaily).filter(
        MetricsDaily.store_id == store_id,
        MetricsDaily.date >= start,
        MetricsDaily.date <= end
    ).all()
    
    if not metrics:
        raise HTTPException(status_code=404, detail="No data found for this store")
    
    # Calculate summary statistics
    total_waste = sum(m.kg_waste for m in metrics)
    total_collected = sum(m.kg_collected for m in metrics)
    total_dollar_loss = sum(m.dollar_loss for m in metrics)
    total_co2e = sum(m.co2e_kg for m in metrics)
    
    return {
        "store_id": store_id,
        "period_start": start,
        "period_end": end,
        "total_waste_kg": total_waste,
        "total_collected_kg": total_collected,
        "total_dollar_loss": total_dollar_loss,
        "total_co2e_kg": total_co2e,
        "efficiency_score": (total_collected / total_waste * 100) if total_waste > 0 else 0
    }
