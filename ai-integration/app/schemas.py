from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional, List, Dict, Any

# Base schemas
class WasteLogCreate(BaseModel):
    store_id: int
    item_id: int
    kg: float
    event_ts: Optional[datetime] = None

class PickupScanCreate(BaseModel):
    volunteer_id: int
    store_id: int
    item_id: int
    kg: float
    scanned_ts: Optional[datetime] = None
    qr_id: Optional[str] = None

class DistributionCreate(BaseModel):
    foodbank_id: int
    item_id: int
    kg: float
    confirmed_ts: Optional[datetime] = None

class OrderCreate(BaseModel):
    store_id: int
    item_id: int
    kg_ordered: float
    week_start: date

# Response schemas
class WasteLogResponse(WasteLogCreate):
    id: int
    event_ts: datetime
    
    class Config:
        from_attributes = True

class PickupResponse(PickupScanCreate):
    id: int
    scanned_ts: datetime
    
    class Config:
        from_attributes = True

class DistributionResponse(DistributionCreate):
    id: int
    confirmed_ts: datetime
    
    class Config:
        from_attributes = True

class OrderResponse(OrderCreate):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AIForecastResponse(BaseModel):
    id: int
    scope: str
    scope_id: int
    item_id: int
    week_start: date
    pred_kg_waste: float
    pred_ci_low: Optional[float]
    pred_ci_high: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

class AIInsightResponse(BaseModel):
    id: int
    store_id: int
    week_start: date
    msg: str
    type: str
    recommended_order_change: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

class MetricsDailyResponse(BaseModel):
    id: int
    date: date
    store_id: int
    item_id: int
    kg_waste: float
    kg_collected: float
    kg_distributed: float
    dollar_loss: float
    co2e_kg: float
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard schemas
class WeeklyReportResponse(BaseModel):
    report: str
    key_findings: List[str]
    store_actions: List[Dict[str, Any]]
    risks: List[str]
    next_week_order_changes: List[Dict[str, Any]]

class DailyMetricsRequest(BaseModel):
    store_id: Optional[int] = None
    start: date
    end: date

class ForecastRequest(BaseModel):
    scope: str  # "store", "item", "category"
    scope_id: int
    item_id: Optional[int] = None
