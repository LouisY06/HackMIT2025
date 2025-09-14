import pandas as pd
import numpy as np
from datetime import datetime, timedelta, date
from typing import Dict, Any, List, Optional
import joblib
import os
from .features import prepare_features

def predict_next_week_waste(store_id: int, item_id: int, db_session) -> Dict[str, Any]:
    """Predict waste for the next week for a specific store-item combination."""
    
    model_path = f"models/model_store_{store_id}_item_{item_id}.joblib"
    
    if not os.path.exists(model_path):
        return {"error": "Model not found - need to train first"}
    
    # Load model
    model = joblib.load(model_path)
    
    # Get recent data for prediction
    from ..models import MetricsDaily
    
    end_date = date.today()
    start_date = end_date - timedelta(days=60)  # Last 60 days
    
    data_query = db_session.query(MetricsDaily).filter(
        MetricsDaily.store_id == store_id,
        MetricsDaily.item_id == item_id,
        MetricsDaily.date >= start_date,
        MetricsDaily.date <= end_date
    ).order_by(MetricsDaily.date)
    
    data = pd.DataFrame([{
        'date': row.date,
        'store_id': row.store_id,
        'item_id': row.item_id,
        'kg_waste': row.kg_waste
    } for row in data_query])
    
    if len(data) == 0:
        return {"error": "No historical data available"}
    
    # Prepare features for prediction
    df = prepare_features(data.copy())
    
    # Get the latest row for prediction
    latest_row = df.iloc[-1:].copy()
    
    # Make prediction for next week
    next_week_date = end_date + timedelta(days=7)
    latest_row['date'] = next_week_date
    latest_row = prepare_features(latest_row)
    
    feature_cols = model.feature_names_in_
    X_pred = latest_row[feature_cols].fillna(0)
    
    prediction = model.predict(X_pred)[0]
    
    # Calculate confidence intervals (simple approach)
    # In production, you'd use more sophisticated methods
    std_error = np.std(df['kg_waste']) * 0.1  # Rough estimate
    ci_low = max(0, prediction - 1.96 * std_error)
    ci_high = prediction + 1.96 * std_error
    
    return {
        "store_id": store_id,
        "item_id": item_id,
        "week_start": next_week_date,
        "pred_kg_waste": float(prediction),
        "pred_ci_low": float(ci_low),
        "pred_ci_high": float(ci_high)
    }

def summarize_forecasts(store_id: int) -> str:
    """Summarize forecasts for a store for the LLM report."""
    # This would query the AIForecast table and format for LLM
    return f"Forecast summary for Store {store_id}: Next week predictions show moderate waste levels with some items trending upward."

def batch_predict_all_models(db_session):
    """Run predictions for all trained models and store results."""
    from ..models import AIForecast
    
    # Get all model files
    model_dir = "models"
    if not os.path.exists(model_dir):
        return {"error": "No models found"}
    
    results = []
    for filename in os.listdir(model_dir):
        if filename.startswith("model_store_") and filename.endswith(".joblib"):
            # Parse store_id and item_id from filename
            parts = filename.replace("model_store_", "").replace(".joblib", "").split("_item_")
            if len(parts) == 2:
                store_id = int(parts[0])
                item_id = int(parts[1])
                
                prediction = predict_next_week_waste(store_id, item_id, db_session)
                
                if "error" not in prediction:
                    # Store prediction in database
                    forecast = AIForecast(
                        scope="store",
                        scope_id=store_id,
                        item_id=item_id,
                        week_start=prediction["week_start"],
                        pred_kg_waste=prediction["pred_kg_waste"],
                        pred_ci_low=prediction["pred_ci_low"],
                        pred_ci_high=prediction["pred_ci_high"]
                    )
                    db_session.add(forecast)
                    results.append(prediction)
    
    db_session.commit()
    return {"predictions_created": len(results), "results": results}
