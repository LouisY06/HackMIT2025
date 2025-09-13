from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from models import get_db, Package, Store, User, PointsTransaction
from utils.dependencies import get_current_user, require_store, require_volunteer, require_central_base
from utils.distance import haversine_distance, calculate_points, calculate_estimated_hours, get_store_by_id
from utils.qr_codes import generate_qr_code, decode_qr_code, validate_qr_code

router = APIRouter(prefix="/packages", tags=["packages"])

# Pydantic models
class PackageCreate(BaseModel):
    store_id: int
    label: Optional[str] = None
    waste_type: Optional[str] = None
    description: Optional[str] = None
    weight_estimate: Optional[float] = None

class PackageResponse(BaseModel):
    id: int
    store_id: int
    volunteer_id: Optional[int]
    qr_code: Optional[str]
    label: Optional[str]
    waste_type: Optional[str]
    status: str
    points_value: int
    estimated_hours: float
    description: Optional[str]
    weight_estimate: Optional[float]
    created_at: datetime
    claimed_at: Optional[datetime]
    picked_up_at: Optional[datetime]
    delivered_at: Optional[datetime]
    store_name: Optional[str] = None
    store_address: Optional[str] = None

    class Config:
        from_attributes = True

class PackageClaim(BaseModel):
    volunteer_lat: float
    volunteer_lng: float

class QRScanData(BaseModel):
    qr_data: str

@router.post("/", response_model=PackageResponse)
async def create_package(
    package_data: PackageCreate,
    current_user: User = Depends(require_store),
    db: Session = Depends(get_db)
):
    """Create a new package (store only)"""
    # Verify store exists and belongs to user
    store = db.query(Store).filter(
        Store.id == package_data.store_id,
        Store.user_id == current_user.id
    ).first()
    
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found or not owned by user"
        )
    
    # Create package
    new_package = Package(
        store_id=package_data.store_id,
        label=package_data.label,
        waste_type=package_data.waste_type,
        description=package_data.description,
        weight_estimate=package_data.weight_estimate,
        status="available",
        points_value=0,  # Will be calculated when claimed
        estimated_hours=0.0
    )
    
    db.add(new_package)
    db.commit()
    db.refresh(new_package)
    
    # Add store info to response
    response = PackageResponse.from_orm(new_package)
    response.store_name = store.name
    response.store_address = store.address
    
    return response

@router.get("/available", response_model=List[PackageResponse])
async def get_available_packages(
    lat: float,
    lng: float,
    max_distance_km: float = 10.0,
    db: Session = Depends(get_db)
):
    """Get available packages within distance"""
    packages = db.query(Package).filter(Package.status == "available").all()
    
    available_packages = []
    for package in packages:
        store = db.query(Store).filter(Store.id == package.store_id).first()
        if store:
            distance = haversine_distance(lat, lng, store.lat, store.lng)
            if distance <= max_distance_km:
                # Calculate points and hours for this package
                package.points_value = calculate_points(distance)
                package.estimated_hours = calculate_estimated_hours(distance)
                
                response = PackageResponse.from_orm(package)
                response.store_name = store.name
                response.store_address = store.address
                available_packages.append(response)
    
    return available_packages

@router.post("/{package_id}/claim", response_model=PackageResponse)
async def claim_package(
    package_id: int,
    claim_data: PackageClaim,
    current_user: User = Depends(require_volunteer),
    db: Session = Depends(get_db)
):
    """Claim a package (volunteer only)"""
    # Get package
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found"
        )
    
    if package.status != "available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Package is not available for claiming"
        )
    
    # Get store info
    store = db.query(Store).filter(Store.id == package.store_id).first()
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found"
        )
    
    # Calculate distance and points
    distance = haversine_distance(claim_data.volunteer_lat, claim_data.volunteer_lng, store.lat, store.lng)
    points = calculate_points(distance)
    estimated_hours = calculate_estimated_hours(distance)
    
    # Update package
    package.volunteer_id = current_user.id
    package.status = "claimed"
    package.points_value = points
    package.estimated_hours = estimated_hours
    package.claimed_at = datetime.utcnow()
    
    # Generate QR code
    qr_data = {
        "package_id": package.id,
        "volunteer_id": current_user.id,
        "points": points
    }
    package.qr_code = generate_qr_code(qr_data)
    
    db.commit()
    db.refresh(package)
    
    # Create response
    response = PackageResponse.from_orm(package)
    response.store_name = store.name
    response.store_address = store.address
    
    return response

@router.post("/{package_id}/pickup", response_model=PackageResponse)
async def pickup_package(
    package_id: int,
    current_user: User = Depends(require_volunteer),
    db: Session = Depends(get_db)
):
    """Mark package as picked up (volunteer only)"""
    package = db.query(Package).filter(
        Package.id == package_id,
        Package.volunteer_id == current_user.id,
        Package.status == "claimed"
    ).first()
    
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found or not claimed by you"
        )
    
    package.status = "picked_up"
    package.picked_up_at = datetime.utcnow()
    
    db.commit()
    db.refresh(package)
    
    # Get store info for response
    store = db.query(Store).filter(Store.id == package.store_id).first()
    response = PackageResponse.from_orm(package)
    if store:
        response.store_name = store.name
        response.store_address = store.address
    
    return response

@router.post("/scan", response_model=dict)
async def scan_qr_code(
    scan_data: QRScanData,
    current_user: User = Depends(require_central_base),
    db: Session = Depends(get_db)
):
    """Scan QR code and mark package as delivered (central base only)"""
    try:
        # Decode QR code
        qr_info = decode_qr_code(scan_data.qr_data)
        package_id = qr_info.get("package_id")
        volunteer_id = qr_info.get("volunteer_id")
        points = qr_info.get("points")
        
        if not all([package_id, volunteer_id, points]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid QR code data"
            )
        
        # Get package
        package = db.query(Package).filter(Package.id == package_id).first()
        if not package:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Package not found"
            )
        
        if package.status != "picked_up":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Package must be picked up before delivery"
            )
        
        # Get volunteer
        volunteer = db.query(User).filter(User.id == volunteer_id).first()
        if not volunteer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Volunteer not found"
            )
        
        # Update package
        package.status = "delivered"
        package.delivered_at = datetime.utcnow()
        
        # Award points to volunteer
        volunteer.points += points
        volunteer.total_hours += package.estimated_hours
        
        # Create points transaction
        transaction = PointsTransaction(
            user_id=volunteer_id,
            package_id=package_id,
            points_change=points,
            transaction_type="delivery",
            description=f"Delivered package {package_id}"
        )
        db.add(transaction)
        
        db.commit()
        
        return {
            "message": "Package delivered successfully",
            "package_id": package_id,
            "volunteer_id": volunteer_id,
            "points_awarded": points,
            "volunteer_new_balance": volunteer.points
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/my-packages", response_model=List[PackageResponse])
async def get_my_packages(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get packages for current user"""
    if current_user.user_type == "volunteer":
        packages = db.query(Package).filter(Package.volunteer_id == current_user.id).all()
    elif current_user.user_type == "store":
        store = db.query(Store).filter(Store.user_id == current_user.id).first()
        if store:
            packages = db.query(Package).filter(Package.store_id == store.id).all()
        else:
            packages = []
    else:
        packages = db.query(Package).all()
    
    # Add store info to responses
    responses = []
    for package in packages:
        store = db.query(Store).filter(Store.id == package.store_id).first()
        response = PackageResponse.from_orm(package)
        if store:
            response.store_name = store.name
            response.store_address = store.address
        responses.append(response)
    
    return responses
