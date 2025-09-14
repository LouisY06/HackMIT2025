#!/usr/bin/env python3
"""
Script to add test packages to Railway production database via API
"""

import requests
import json

# Railway API base URL
API_BASE_URL = "https://hackmit2025-production.up.railway.app"

def add_test_package(store_name, store_email, food_type, weight_lbs, pickup_start, pickup_end, instructions="Handle with care"):
    """Add a test package via API"""
    
    package_data = {
        "store_name": store_name,
        "store_email": store_email,
        "food_type": food_type,
        "weight_lbs": weight_lbs,
        "pickup_window_start": pickup_start,
        "pickup_window_end": pickup_end,
        "special_instructions": instructions
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/api/packages", json=package_data)
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print(f"✅ Created package: {food_type} ({weight_lbs} lbs) from {store_email}")
                return True
            else:
                print(f"❌ Failed to create package: {result.get('error')}")
                return False
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error creating package: {e}")
        return False

def main():
    print("🚀 Adding test packages to Railway production database...")
    
    # Test packages to create
    test_packages = [
        {
            "store_name": "Flour Bakery",
            "store_email": "sarah@flourbakery.com",
            "food_type": "Pastries & Bread",
            "weight_lbs": 5.2,
            "pickup_start": "2:00 PM",
            "pickup_end": "6:00 PM",
            "instructions": "Handle with care - contains delicate pastries"
        },
        {
            "store_name": "Whole Foods Market",
            "store_email": "manager@wholefoodsmarket.com", 
            "food_type": "Produce",
            "weight_lbs": 8.5,
            "pickup_start": "10:00 AM",
            "pickup_end": "2:00 PM",
            "instructions": "Fresh vegetables - keep cool"
        },
        {
            "store_name": "Trader Joe's",
            "store_email": "orders@traderjoes.com",
            "food_type": "Prepared Meals", 
            "weight_lbs": 6.3,
            "pickup_start": "4:00 PM",
            "pickup_end": "8:00 PM",
            "instructions": "Refrigerated items - deliver quickly"
        },
        {
            "store_name": "Flour Bakery",
            "store_email": "sarah@flourbakery.com",
            "food_type": "Dairy",
            "weight_lbs": 3.8,
            "pickup_start": "1:00 PM", 
            "pickup_end": "5:00 PM",
            "instructions": "Temperature sensitive - use insulated bag"
        },
        {
            "store_name": "Whole Foods Market",
            "store_email": "manager@wholefoodsmarket.com",
            "food_type": "Pastries & Bread",
            "weight_lbs": 4.7,
            "pickup_start": "3:00 PM",
            "pickup_end": "7:00 PM", 
            "instructions": "Day-old bakery items"
        }
    ]
    
    success_count = 0
    for package in test_packages:
        if add_test_package(**package):
            success_count += 1
    
    print(f"\n🎉 Successfully created {success_count}/{len(test_packages)} packages!")
    
    # Verify packages were created
    print("\n🔍 Checking current packages...")
    try:
        response = requests.get(f"{API_BASE_URL}/api/packages/available")
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                packages = result.get('packages', [])
                print(f"📦 Total packages available: {len(packages)}")
                for i, pkg in enumerate(packages, 1):
                    print(f"  {i}. {pkg.get('food_type')} - {pkg.get('weight_lbs')} lbs - {pkg.get('store_name', 'Unknown Store')}")
            else:
                print(f"❌ Failed to fetch packages: {result.get('error')}")
        else:
            print(f"❌ HTTP Error {response.status_code}")
    except Exception as e:
        print(f"❌ Error fetching packages: {e}")

if __name__ == "__main__":
    main()
