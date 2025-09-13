from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    user_type = Column(String, nullable=False)  # "volunteer", "store", "central_base"
    name = Column(String, nullable=False)
    points = Column(Integer, default=0)
    total_hours = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    store = relationship("Store", back_populates="user", uselist=False)
    claimed_packages = relationship("Package", back_populates="volunteer")
    points_transactions = relationship("PointsTransaction", back_populates="user")

class Store(Base):
    __tablename__ = "stores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="store")
    packages = relationship("Package", back_populates="store")

class Package(Base):
    __tablename__ = "packages"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    volunteer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    qr_code = Column(String, nullable=True)  # Base64 encoded QR code
    label = Column(String, nullable=True)  # AI-generated label
    waste_type = Column(String, nullable=True)  # "food", "recyclable", "compost", etc.
    status = Column(String, default="available")  # "available", "claimed", "picked_up", "delivered"
    points_value = Column(Integer, default=0)
    estimated_hours = Column(Float, default=0.0)
    description = Column(Text, nullable=True)
    weight_estimate = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    claimed_at = Column(DateTime, nullable=True)
    picked_up_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    
    # Relationships
    store = relationship("Store", back_populates="packages")
    volunteer = relationship("User", back_populates="claimed_packages")
    points_transactions = relationship("PointsTransaction", back_populates="package")

class Reward(Base):
    __tablename__ = "rewards"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    points_cost = Column(Integer, nullable=False)
    sponsor_store = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PointsTransaction(Base):
    __tablename__ = "points_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    package_id = Column(Integer, ForeignKey("packages.id"), nullable=True)
    points_change = Column(Integer, nullable=False)  # Positive for earning, negative for spending
    transaction_type = Column(String, nullable=False)  # "delivery", "bonus", "reward_redemption"
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="points_transactions")
    package = relationship("Package", back_populates="points_transactions")
