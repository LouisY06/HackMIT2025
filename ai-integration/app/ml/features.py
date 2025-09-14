import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Any

def extract_time_features(df: pd.DataFrame) -> pd.DataFrame:
    """Extract time-based features for ML models."""
    df['day_of_week'] = df['date'].dt.dayofweek
    df['week_of_year'] = df['date'].dt.isocalendar().week
    df['month'] = df['date'].dt.month
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    df['is_holiday'] = df['date'].apply(is_holiday)
    return df

def is_holiday(date) -> int:
    """Simple holiday detection (can be enhanced)."""
    # Major US holidays that might affect food waste patterns
    holidays_2024 = [
        datetime(2024, 1, 1),   # New Year
        datetime(2024, 7, 4),   # Independence Day
        datetime(2024, 12, 25), # Christmas
        datetime(2024, 11, 28), # Thanksgiving
    ]
    return int(date in holidays_2024)

def create_lag_features(df: pd.DataFrame, target_col: str, lags: List[int]) -> pd.DataFrame:
    """Create lag features for time series prediction."""
    for lag in lags:
        df[f'{target_col}_lag_{lag}'] = df[target_col].shift(lag)
    return df

def create_rolling_features(df: pd.DataFrame, target_col: str, windows: List[int]) -> pd.DataFrame:
    """Create rolling window features."""
    for window in windows:
        df[f'{target_col}_rolling_{window}'] = df[target_col].rolling(window=window).mean()
    return df

def prepare_features(df: pd.DataFrame, target_col: str = 'kg_waste') -> pd.DataFrame:
    """Prepare all features for ML models."""
    df = extract_time_features(df)
    df = create_lag_features(df, target_col, [1, 7, 14])  # 1 day, 1 week, 2 weeks
    df = create_rolling_features(df, target_col, [7, 14, 30])  # 1 week, 2 weeks, 1 month
    return df.fillna(0)
