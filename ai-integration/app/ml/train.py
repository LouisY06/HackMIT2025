import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import joblib
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from .features import prepare_features

def train_waste_prediction_model(store_id: int, item_id: int, data: pd.DataFrame) -> Dict[str, Any]:
    """Train a waste prediction model for a specific store-item combination."""
    
    if len(data) < 30:  # Need minimum data for training
        return {"error": "Insufficient data for training"}
    
    # Prepare features
    df = prepare_features(data.copy())
    
    # Define features and target
    feature_cols = [col for col in df.columns if col not in ['kg_waste', 'date', 'store_id', 'item_id']]
    X = df[feature_cols]
    y = df['kg_waste']
    
    # Remove rows with NaN values
    mask = ~(X.isna().any(axis=1) | y.isna())
    X = X[mask]
    y = y[mask]
    
    if len(X) < 10:
        return {"error": "Insufficient valid data after feature preparation"}
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Make predictions for evaluation
    y_pred = model.predict(X)
    mae = mean_absolute_error(y, y_pred)
    rmse = np.sqrt(mean_squared_error(y, y_pred))
    
    # Save model
    model_dir = "models"
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, f"model_store_{store_id}_item_{item_id}.joblib")
    joblib.dump(model, model_path)
    
    return {
        "model_path": model_path,
        "feature_columns": feature_cols,
        "mae": mae,
        "rmse": rmse,
        "training_samples": len(X)
    }

def train_all_models(db_session):
    """Train models for all store-item combinations with sufficient data."""
    from ..models import MetricsDaily
    
    # Get all unique store-item combinations
    query = db_session.query(MetricsDaily.store_id, MetricsDaily.item_id).distinct()
    combinations = query.all()
    
    results = []
    for store_id, item_id in combinations:
        # Get data for this combination
        data_query = db_session.query(MetricsDaily).filter(
            MetricsDaily.store_id == store_id,
            MetricsDaily.item_id == item_id
        ).order_by(MetricsDaily.date)
        
        data = pd.DataFrame([{
            'date': row.date,
            'store_id': row.store_id,
            'item_id': row.item_id,
            'kg_waste': row.kg_waste
        } for row in data_query])
        
        if len(data) > 0:
            result = train_waste_prediction_model(store_id, item_id, data)
            result.update({"store_id": store_id, "item_id": item_id})
            results.append(result)
    
    return results
