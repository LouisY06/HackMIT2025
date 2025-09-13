from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any
from models import get_db, Package, Store, User, PointsTransaction
from utils.dependencies import require_central_base, get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

class WasteStats(BaseModel):
    total_packages: int
    total_weight_kg: float
    packages_by_type: Dict[str, int]
    packages_by_status: Dict[str, int]

class CarbonStats(BaseModel):
    estimated_carbon_saved_kg: float
    waste_diverted_kg: float
    equivalent_trees_planted: float

class StoreStats(BaseModel):
    store_id: int
    store_name: str
    total_packages: int
    packages_delivered: int
    total_weight_kg: float
    average_delivery_time_hours: float

@router.get("/waste-prevented", response_model=WasteStats)
async def get_waste_prevented_stats(
    current_user: User = Depends(require_central_base),
    db: Session = Depends(get_db)
):
    """Get waste prevention statistics"""
    # Get all packages
    packages = db.query(Package).all()
    
    total_packages = len(packages)
    total_weight = sum(p.weight_estimate or 0 for p in packages)
    
    # Count by waste type
    packages_by_type = {}
    for package in packages:
        waste_type = package.waste_type or "unknown"
        packages_by_type[waste_type] = packages_by_type.get(waste_type, 0) + 1
    
    # Count by status
    packages_by_status = {}
    for package in packages:
        status = package.status
        packages_by_status[status] = packages_by_status.get(status, 0) + 1
    
    return WasteStats(
        total_packages=total_packages,
        total_weight_kg=round(total_weight, 2),
        packages_by_type=packages_by_type,
        packages_by_status=packages_by_status
    )

@router.get("/carbon-saved", response_model=CarbonStats)
async def get_carbon_saved_stats(
    current_user: User = Depends(require_central_base),
    db: Session = Depends(get_db)
):
    """Get carbon savings statistics"""
    # Get delivered packages
    delivered_packages = db.query(Package).filter(Package.status == "delivered").all()
    
    total_weight = sum(p.weight_estimate or 1.0 for p in delivered_packages)  # Default 1kg if no weight
    
    # Rough estimates for carbon savings
    # Food waste: ~2.5kg CO2 per kg diverted from landfill
    # Recyclable: ~1.5kg CO2 per kg recycled vs landfill
    # General waste: ~1kg CO2 per kg diverted
    
    carbon_saved = 0
    for package in delivered_packages:
        weight = package.weight_estimate or 1.0
        if package.waste_type == "food":
            carbon_saved += weight * 2.5
        elif package.waste_type == "recyclable":
            carbon_saved += weight * 1.5
        else:
            carbon_saved += weight * 1.0
    
    # Rough estimate: 1 tree absorbs ~22kg CO2 per year
    equivalent_trees = carbon_saved / 22
    
    return CarbonStats(
        estimated_carbon_saved_kg=round(carbon_saved, 2),
        waste_diverted_kg=round(total_weight, 2),
        equivalent_trees_planted=round(equivalent_trees, 2)
    )

@router.get("/store/{store_id}/stats", response_model=StoreStats)
async def get_store_stats(
    store_id: int,
    current_user: User = Depends(require_central_base),
    db: Session = Depends(get_db)
):
    """Get store-specific statistics"""
    # Get store
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found"
        )
    
    # Get packages for this store
    packages = db.query(Package).filter(Package.store_id == store_id).all()
    delivered_packages = [p for p in packages if p.status == "delivered"]
    
    total_packages = len(packages)
    packages_delivered = len(delivered_packages)
    total_weight = sum(p.weight_estimate or 0 for p in delivered_packages)
    
    # Calculate average delivery time
    avg_delivery_time = 0.0
    if delivered_packages:
        total_time = 0
        for package in delivered_packages:
            if package.claimed_at and package.delivered_at:
                time_diff = package.delivered_at - package.claimed_at
                total_time += time_diff.total_seconds() / 3600  # Convert to hours
        avg_delivery_time = total_time / len(delivered_packages)
    
    return StoreStats(
        store_id=store.id,
        store_name=store.name,
        total_packages=total_packages,
        packages_delivered=packages_delivered,
        total_weight_kg=round(total_weight, 2),
        average_delivery_time_hours=round(avg_delivery_time, 2)
    )

@router.get("/dashboard")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics based on user type"""
    if current_user.user_type == "volunteer":
        # Volunteer dashboard
        my_packages = db.query(Package).filter(Package.volunteer_id == current_user.id).all()
        delivered_packages = [p for p in my_packages if p.status == "delivered"]
        
        return {
            "user_type": "volunteer",
            "total_points": current_user.points,
            "total_hours": current_user.total_hours,
            "packages_claimed": len(my_packages),
            "packages_delivered": len(delivered_packages),
            "total_weight_delivered": sum(p.weight_estimate or 0 for p in delivered_packages),
            "average_points_per_delivery": round(current_user.points / max(len(delivered_packages), 1), 2)
        }
    
    elif current_user.user_type == "store":
        # Store dashboard
        store = db.query(Store).filter(Store.user_id == current_user.id).first()
        if store:
            packages = db.query(Package).filter(Package.store_id == store.id).all()
            delivered_packages = [p for p in packages if p.status == "delivered"]
            
            return {
                "user_type": "store",
                "store_name": store.name,
                "total_packages_created": len(packages),
                "packages_delivered": len(delivered_packages),
                "total_weight_processed": sum(p.weight_estimate or 0 for p in delivered_packages),
                "delivery_rate": round(len(delivered_packages) / max(len(packages), 1) * 100, 2)
            }
        else:
            return {"user_type": "store", "message": "No store associated with this user"}
    
    else:  # central_base
        # Central base dashboard
        all_packages = db.query(Package).all()
        delivered_packages = [p for p in all_packages if p.status == "delivered"]
        all_users = db.query(User).all()
        volunteers = [u for u in all_users if u.user_type == "volunteer"]
        
        return {
            "user_type": "central_base",
            "total_packages_processed": len(all_packages),
            "packages_delivered": len(delivered_packages),
            "total_volunteers": len(volunteers),
            "total_weight_processed": sum(p.weight_estimate or 0 for p in delivered_packages),
            "active_volunteers": len([u for u in volunteers if u.points > 0])
        }
