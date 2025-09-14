from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, JSON, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .db import Base

class Store(Base):
    __tablename__ = "stores"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    waste_logs = relationship("WasteLog", back_populates="store")
    pickups = relationship("Pickup", back_populates="store")
    orders = relationship("Order", back_populates="store")
    ai_insights = relationship("AIInsight", back_populates="store")
    metrics_daily = relationship("MetricsDaily", back_populates="store")

class Volunteer(Base):
    __tablename__ = "volunteers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    rating = Column(Float, default=5.0)
    typical_hours = Column(JSON)  # {"monday": [9, 17], ...}
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    pickups = relationship("Pickup", back_populates="volunteer")

class Foodbank(Base):
    __tablename__ = "foodbanks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    capacity_freezer = Column(Float)  # kg
    capacity_dry = Column(Float)  # kg
    address = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    distributions = relationship("Distribution", back_populates="foodbank")

class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    shelf_life_days = Column(Integer)
    retail_value_per_kg = Column(Float)
    co2e_factor_per_kg = Column(Float, default=1.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    waste_logs = relationship("WasteLog", back_populates="item")
    pickups = relationship("Pickup", back_populates="item")
    distributions = relationship("Distribution", back_populates="item")
    orders = relationship("Order", back_populates="item")
    ai_forecasts = relationship("AIForecast", back_populates="item")
    metrics_daily = relationship("MetricsDaily", back_populates="item")

class WasteLog(Base):
    __tablename__ = "waste_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    kg = Column(Float, nullable=False)
    event_ts = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    store = relationship("Store", back_populates="waste_logs")
    item = relationship("Item", back_populates="waste_logs")

class Pickup(Base):
    __tablename__ = "pickups"
    
    id = Column(Integer, primary_key=True, index=True)
    volunteer_id = Column(Integer, ForeignKey("volunteers.id"))
    store_id = Column(Integer, ForeignKey("stores.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    kg = Column(Float, nullable=False)
    scanned_ts = Column(DateTime(timezone=True), server_default=func.now())
    qr_id = Column(String)
    
    # Relationships
    volunteer = relationship("Volunteer", back_populates="pickups")
    store = relationship("Store", back_populates="pickups")
    item = relationship("Item", back_populates="pickups")

class Distribution(Base):
    __tablename__ = "distributions"
    
    id = Column(Integer, primary_key=True, index=True)
    foodbank_id = Column(Integer, ForeignKey("foodbanks.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    kg = Column(Float, nullable=False)
    confirmed_ts = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    foodbank = relationship("Foodbank", back_populates="distributions")
    item = relationship("Item", back_populates="distributions")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    kg_ordered = Column(Float, nullable=False)
    week_start = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    store = relationship("Store", back_populates="orders")
    item = relationship("Item", back_populates="orders")

class AIForecast(Base):
    __tablename__ = "ai_forecasts"
    
    id = Column(Integer, primary_key=True, index=True)
    scope = Column(String, nullable=False)  # "store", "item", "category"
    scope_id = Column(Integer, nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"))
    week_start = Column(Date, nullable=False)
    pred_kg_waste = Column(Float, nullable=False)
    pred_ci_low = Column(Float)
    pred_ci_high = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    item = relationship("Item", back_populates="ai_forecasts")

class AIInsight(Base):
    __tablename__ = "ai_insights"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"))
    week_start = Column(Date, nullable=False)
    msg = Column(Text, nullable=False)
    type = Column(String, nullable=False)  # "recommendation", "warning", "insight"
    recommended_order_change = Column(Float)  # percentage change
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    store = relationship("Store", back_populates="ai_insights")

class MetricsDaily(Base):
    __tablename__ = "metrics_daily"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    store_id = Column(Integer, ForeignKey("stores.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    kg_waste = Column(Float, default=0.0)
    kg_collected = Column(Float, default=0.0)
    kg_distributed = Column(Float, default=0.0)
    dollar_loss = Column(Float, default=0.0)
    co2e_kg = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    store = relationship("Store", back_populates="metrics_daily")
    item = relationship("Item", back_populates="metrics_daily")
