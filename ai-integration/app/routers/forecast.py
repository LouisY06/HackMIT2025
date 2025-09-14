from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..db import get_db
from ..models import AIForecast
from ..schemas import ForecastRequest, AIForecastResponse
from ..ml.predict import predict_next_week_waste

router = APIRouter(prefix="/forecast", tags=["forecast"])

@router.get("/next-week", response_model=list[AIForecastResponse])
def get_next_week_forecast(
    scope: str = Query(...),
    scope_id: int = Query(...),
    item_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Get forecasts for next week."""
    query = db.query(AIForecast).filter(
        AIForecast.scope == scope,
        AIForecast.scope_id == scope_id
    )
    
    if item_id:
        query = query.filter(AIForecast.item_id == item_id)
    
    forecasts = query.all()
    
    if not forecasts:
        # Try to generate prediction on-the-fly
        if scope == "store" and item_id:
            prediction = predict_next_week_waste(scope_id, item_id, db)
            if "error" not in prediction:
                # Create new forecast record
                forecast = AIForecast(
                    scope=scope,
                    scope_id=scope_id,
                    item_id=item_id,
                    week_start=prediction["week_start"],
                    pred_kg_waste=prediction["pred_kg_waste"],
                    pred_ci_low=prediction["pred_ci_low"],
                    pred_ci_high=prediction["pred_ci_high"]
                )
                db.add(forecast)
                db.commit()
                db.refresh(forecast)
                return [forecast]
        
        raise HTTPException(status_code=404, detail="No forecasts found")
    
    return forecasts

@router.post("/generate/{store_id}")
def generate_forecast_for_store(store_id: int, db: Session = Depends(get_db)):
    """Generate forecast for a specific store."""
    from ..models import MetricsDaily
    
    # Get all items for this store
    items = db.query(MetricsDaily.item_id).filter(
        MetricsDaily.store_id == store_id
    ).distinct().all()
    
    results = []
    for (item_id,) in items:
        prediction = predict_next_week_waste(store_id, item_id, db)
        if "error" not in prediction:
            results.append(prediction)
    
    return {"store_id": store_id, "predictions_generated": len(results), "results": results}
