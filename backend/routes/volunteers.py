from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from models import get_db, User, Package, PointsTransaction, Store
from utils.dependencies import require_volunteer, get_current_user
from utils.distance import haversine_distance, calculate_points, calculate_estimated_hours

router = APIRouter(prefix="/volunteers", tags=["volunteers"])

class LeaderboardEntry(BaseModel):
    user_id: int
    name: str
    points: int
    total_hours: float
    deliveries_completed: int
    rank: int

class VolunteerStats(BaseModel):
    user_id: int
    name: str
    points: int
    total_hours: float
    deliveries_completed: int
    packages_claimed: int
    packages_picked_up: int
    packages_delivered: int
    average_points_per_delivery: float

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_volunteer_leaderboard(
    limit: int = 10,
    sort_by: str = "points",  # "points", "deliveries", "hours"
    db: Session = Depends(get_db)
):
    """Get volunteer leaderboard"""
    # Get all volunteers
    volunteers = db.query(User).filter(User.user_type == "volunteer").all()
    
    leaderboard_data = []
    for volunteer in volunteers:
        # Count deliveries
        deliveries = db.query(Package).filter(
            Package.volunteer_id == volunteer.id,
            Package.status == "delivered"
        ).count()
        
        leaderboard_data.append({
            "user_id": volunteer.id,
            "name": volunteer.name,
            "points": volunteer.points,
            "total_hours": volunteer.total_hours,
            "deliveries_completed": deliveries
        })
    
    # Sort by specified criteria
    if sort_by == "points":
        leaderboard_data.sort(key=lambda x: x["points"], reverse=True)
    elif sort_by == "deliveries":
        leaderboard_data.sort(key=lambda x: x["deliveries_completed"], reverse=True)
    elif sort_by == "hours":
        leaderboard_data.sort(key=lambda x: x["total_hours"], reverse=True)
    
    # Add rank and limit results
    result = []
    for i, entry in enumerate(leaderboard_data[:limit]):
        entry["rank"] = i + 1
        result.append(LeaderboardEntry(**entry))
    
    return result

@router.get("/stats", response_model=VolunteerStats)
async def get_volunteer_stats(
    current_user: User = Depends(require_volunteer),
    db: Session = Depends(get_db)
):
    """Get current volunteer's detailed statistics"""
    # Count different package statuses
    packages_claimed = db.query(Package).filter(
        Package.volunteer_id == current_user.id,
        Package.status.in_(["claimed", "picked_up", "delivered"])
    ).count()
    
    packages_picked_up = db.query(Package).filter(
        Package.volunteer_id == current_user.id,
        Package.status.in_(["picked_up", "delivered"])
    ).count()
    
    packages_delivered = db.query(Package).filter(
        Package.volunteer_id == current_user.id,
        Package.status == "delivered"
    ).count()
    
    # Calculate average points per delivery
    avg_points = 0.0
    if packages_delivered > 0:
        avg_points = current_user.points / packages_delivered
    
    return VolunteerStats(
        user_id=current_user.id,
        name=current_user.name,
        points=current_user.points,
        total_hours=current_user.total_hours,
        deliveries_completed=packages_delivered,
        packages_claimed=packages_claimed,
        packages_picked_up=packages_picked_up,
        packages_delivered=packages_delivered,
        average_points_per_delivery=round(avg_points, 2)
    )

@router.get("/nearby-packages")
async def get_nearby_packages(
    lat: float,
    lng: float,
    max_distance_km: float = 5.0,
    waste_type: Optional[str] = None,
    min_points: Optional[int] = None,
    sort_by: str = "distance",  # "distance", "points", "created_at"
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get packages near volunteer location with filtering"""
    # Get available packages
    query = db.query(Package).filter(Package.status == "available")
    
    # Apply filters
    if waste_type:
        query = query.filter(Package.waste_type == waste_type)
    
    packages = query.all()
    
    # Calculate distance and filter by distance
    nearby_packages = []
    for package in packages:
        # Get store location
        store = db.query(Store).filter(Store.id == package.store_id).first()
        if not store:
            continue
        
        distance = haversine_distance(lat, lng, store.lat, store.lng)
        if distance <= max_distance_km:
            # Calculate points for this package
            points = calculate_points(distance)
            estimated_hours = calculate_estimated_hours(distance)
            
            package_data = {
                "package_id": package.id,
                "store_name": store.name,
                "store_address": store.address,
                "distance_km": round(distance, 2),
                "points": points,
                "estimated_hours": estimated_hours,
                "waste_type": package.waste_type,
                "description": package.description,
                "weight_estimate": package.weight_estimate,
                "created_at": package.created_at
            }
            
            # Apply points filter
            if min_points is None or points >= min_points:
                nearby_packages.append(package_data)
    
    # Sort results
    if sort_by == "distance":
        nearby_packages.sort(key=lambda x: x["distance_km"])
    elif sort_by == "points":
        nearby_packages.sort(key=lambda x: x["points"], reverse=True)
    elif sort_by == "created_at":
        nearby_packages.sort(key=lambda x: x["created_at"], reverse=True)
    
    return nearby_packages[:limit]

@router.get("/my-journey")
async def get_my_journey(
    current_user: User = Depends(require_volunteer),
    db: Session = Depends(get_db)
):
    """Get volunteer's journey and achievements"""
    # Get all packages for this volunteer
    packages = db.query(Package).filter(
        Package.volunteer_id == current_user.id
    ).order_by(Package.created_at.desc()).all()
    
    journey_data = []
    for package in packages:
        store = db.query(Store).filter(Store.id == package.store_id).first()
        journey_data.append({
            "package_id": package.id,
            "status": package.status,
            "store_name": store.name if store else "Unknown Store",
            "waste_type": package.waste_type,
            "points_earned": package.points_value,
            "estimated_hours": package.estimated_hours,
            "created_at": package.created_at,
            "claimed_at": package.claimed_at,
            "picked_up_at": package.picked_up_at,
            "delivered_at": package.delivered_at
        })
    
    # Calculate achievements
    achievements = []
    if current_user.points >= 100:
        achievements.append("Century Club - 100+ points earned!")
    if current_user.total_hours >= 10:
        achievements.append("Dedicated Volunteer - 10+ hours served!")
    if len([p for p in packages if p.status == "delivered"]) >= 5:
        achievements.append("Delivery Expert - 5+ successful deliveries!")
    
    return {
        "volunteer_name": current_user.name,
        "total_points": current_user.points,
        "total_hours": current_user.total_hours,
        "packages_in_journey": len(journey_data),
        "achievements": achievements,
        "journey": journey_data
    }
