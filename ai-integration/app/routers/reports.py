from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta
from ..db import get_db
from ..models import MetricsDaily
from ..services.finance import make_dollar_table
from ..services.carbon import make_co2e_table
from ..ml.predict import summarize_forecasts
from ..ai.report import generate_weekly_report

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/weekly/{store_id}")
def weekly_report(store_id: int, db: Session = Depends(get_db)):
    """Generate weekly AI report for a store."""
    end = date.today()
    start = end - timedelta(days=6)
    
    # Pull aggregates for the window
    q = db.query(MetricsDaily).filter(
        MetricsDaily.date.between(start, end), 
        MetricsDaily.store_id == store_id
    )
    rows = q.all()
    
    if not rows:
        raise HTTPException(status_code=404, detail="No data found for this store")
    
    # Convert to simple dicts for the LLM
    aggregates = [
        {
            "date": r.date.isoformat(),
            "item_id": r.item_id,
            "kg_waste": r.kg_waste,
            "dollar_loss": r.dollar_loss,
            "co2e_kg": r.co2e_kg,
        } for r in rows
    ]
    
    dollar_table = make_dollar_table(rows)
    co2e_table = make_co2e_table(rows)
    forecast_summary = summarize_forecasts(store_id)
    
    payload = generate_weekly_report(aggregates, dollar_table, co2e_table, forecast_summary)
    return payload
