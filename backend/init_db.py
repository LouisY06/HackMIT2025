#!/usr/bin/env python3
"""
Database initialization script
Run this to create the database tables and seed initial data
"""

from models import create_tables, SessionLocal, User, Store, Reward
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def seed_initial_data():
    """Create initial test data for demo"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).first():
            print("Database already has data, skipping seed...")
            return
        
        # Create test users
        test_users = [
            {
                "email": "volunteer@test.com",
                "password": "password123",
                "user_type": "volunteer",
                "name": "Test Volunteer",
                "points": 0
            },
            {
                "email": "store@test.com", 
                "password": "password123",
                "user_type": "store",
                "name": "Test Store Owner",
                "points": 0
            },
            {
                "email": "central@test.com",
                "password": "password123", 
                "user_type": "central_base",
                "name": "Central Base Manager",
                "points": 0
            }
        ]
        
        created_users = []
        for user_data in test_users:
            user = User(
                email=user_data["email"],
                password_hash=hash_password(user_data["password"]),
                user_type=user_data["user_type"],
                name=user_data["name"],
                points=user_data["points"]
            )
            db.add(user)
            created_users.append(user)
        
        db.commit()
        
        # Create test store
        store_user = next(u for u in created_users if u.user_type == "store")
        test_store = Store(
            user_id=store_user.id,
            name="Demo Grocery Store",
            address="123 Main St, Cambridge, MA",
            lat=42.3601,
            lng=-71.0589
        )
        db.add(test_store)
        db.commit()
        
        # Create sample rewards
        sample_rewards = [
            {
                "name": "Free Coffee",
                "points_cost": 50,
                "sponsor_store": "Local Coffee Shop",
                "description": "Get a free coffee at participating locations"
            },
            {
                "name": "10% Store Discount",
                "points_cost": 100,
                "sponsor_store": "Demo Grocery Store", 
                "description": "10% off your next purchase"
            },
            {
                "name": "Eco-Friendly Tote Bag",
                "points_cost": 200,
                "sponsor_store": "Green Store",
                "description": "Reusable tote bag made from recycled materials"
            }
        ]
        
        for reward_data in sample_rewards:
            reward = Reward(**reward_data)
            db.add(reward)
        
        db.commit()
        print("✅ Database seeded with initial test data!")
        print("Test accounts created:")
        print("- volunteer@test.com / password123 (volunteer)")
        print("- store@test.com / password123 (store)")
        print("- central@test.com / password123 (central_base)")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating database tables...")
    create_tables()
    print("✅ Database tables created!")
    
    print("Seeding initial data...")
    seed_initial_data()
