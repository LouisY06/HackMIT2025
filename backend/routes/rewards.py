from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime
from models import get_db, Reward, User, PointsTransaction
from utils.dependencies import get_current_user, require_volunteer

router = APIRouter(prefix="/rewards", tags=["rewards"])

class RewardResponse(BaseModel):
    id: int
    name: str
    points_cost: int
    sponsor_store: str
    description: str
    is_active: bool

    class Config:
        from_attributes = True

class RewardRedemption(BaseModel):
    reward_id: int

class RedemptionResponse(BaseModel):
    message: str
    reward_name: str
    points_spent: int
    remaining_points: int

@router.get("/", response_model=List[RewardResponse])
async def get_available_rewards(
    db: Session = Depends(get_db)
):
    """Get all available rewards"""
    rewards = db.query(Reward).filter(Reward.is_active == True).all()
    return rewards

@router.post("/{reward_id}/redeem", response_model=RedemptionResponse)
async def redeem_reward(
    reward_id: int,
    current_user: User = Depends(require_volunteer),
    db: Session = Depends(get_db)
):
    """Redeem a reward (volunteer only)"""
    # Get reward
    reward = db.query(Reward).filter(
        Reward.id == reward_id,
        Reward.is_active == True
    ).first()
    
    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reward not found or not available"
        )
    
    # Check if user has enough points
    if current_user.points < reward.points_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient points. Required: {reward.points_cost}, Available: {current_user.points}"
        )
    
    # Deduct points
    current_user.points -= reward.points_cost
    
    # Create transaction record
    transaction = PointsTransaction(
        user_id=current_user.id,
        points_change=-reward.points_cost,
        transaction_type="reward_redemption",
        description=f"Redeemed reward: {reward.name}"
    )
    db.add(transaction)
    
    db.commit()
    
    return RedemptionResponse(
        message=f"Successfully redeemed {reward.name}!",
        reward_name=reward.name,
        points_spent=reward.points_cost,
        remaining_points=current_user.points
    )

@router.get("/my-redemptions")
async def get_my_redemptions(
    current_user: User = Depends(require_volunteer),
    db: Session = Depends(get_db)
):
    """Get current user's reward redemptions"""
    redemptions = db.query(PointsTransaction).filter(
        PointsTransaction.user_id == current_user.id,
        PointsTransaction.transaction_type == "reward_redemption"
    ).order_by(PointsTransaction.created_at.desc()).all()
    
    redemption_history = []
    for transaction in redemptions:
        redemption_history.append({
            "id": transaction.id,
            "description": transaction.description,
            "points_spent": abs(transaction.points_change),
            "redeemed_at": transaction.created_at
        })
    
    return {
        "user_id": current_user.id,
        "current_points": current_user.points,
        "total_redemptions": len(redemption_history),
        "redemption_history": redemption_history
    }
