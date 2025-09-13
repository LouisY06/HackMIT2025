from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import timedelta
from models import get_db, User
from utils.auth import verify_password, get_password_hash, create_access_token
from utils.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["authentication"])

# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    user_type: str  # "volunteer", "store", "central_base"
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_type: str
    user_id: int

class UserResponse(BaseModel):
    id: int
    email: str
    user_type: str
    name: str
    points: int
    total_hours: float

    class Config:
        from_attributes = True

@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Validate user type
    if user_data.user_type not in ["volunteer", "store", "central_base"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user type. Must be 'volunteer', 'store', or 'central_base'"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        user_type=user_data.user_type,
        name=user_data.name,
        points=0,
        total_hours=0.0
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=Token)
async def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    # Find user by email
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "user_type": user.user_type
        },
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": user.user_type,
        "user_id": user.id
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user
