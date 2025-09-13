from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models import get_db, User
from utils.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

class UserUpdate(BaseModel):
    name: str = None
    email: str = None

class UserResponse(BaseModel):
    id: int
    email: str
    user_type: str
    name: str
    points: int
    total_hours: float

    class Config:
        from_attributes = True

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile"""
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    # Check if email is being changed and if it's already taken
    if user_update.email and user_update.email != current_user.email:
        existing_user = db.query(User).filter(User.email == user_update.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already taken"
            )
        current_user.email = user_update.email
    
    # Update name if provided
    if user_update.name:
        current_user.name = user_update.name
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/stats")
async def get_user_stats(current_user: User = Depends(get_current_user)):
    """Get user statistics"""
    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "user_type": current_user.user_type,
        "points": current_user.points,
        "total_hours": current_user.total_hours,
        "deliveries_completed": len([p for p in current_user.claimed_packages if p.status == "delivered"])
    }
