from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import WasteLog, Pickup, Distribution
from ..schemas import WasteLogCreate, PickupScanCreate, DistributionCreate, WasteLogResponse, PickupResponse, DistributionResponse

router = APIRouter(prefix="/ingest", tags=["ingest"])

@router.post("/waste-log", response_model=WasteLogResponse)
def create_waste_log(waste_log: WasteLogCreate, db: Session = Depends(get_db)):
    """Ingest a waste log event."""
    db_waste_log = WasteLog(**waste_log.dict())
    db.add(db_waste_log)
    db.commit()
    db.refresh(db_waste_log)
    return db_waste_log

@router.post("/pickup-scan", response_model=PickupResponse)
def create_pickup_scan(pickup: PickupScanCreate, db: Session = Depends(get_db)):
    """Ingest a pickup scan event."""
    db_pickup = Pickup(**pickup.dict())
    db.add(db_pickup)
    db.commit()
    db.refresh(db_pickup)
    return db_pickup

@router.post("/distribution", response_model=DistributionResponse)
def create_distribution(distribution: DistributionCreate, db: Session = Depends(get_db)):
    """Ingest a distribution event."""
    db_distribution = Distribution(**distribution.dict())
    db.add(db_distribution)
    db.commit()
    db.refresh(db_distribution)
    return db_distribution
