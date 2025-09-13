# 24-Hour Hackathon Backend Development Plan
**Waste Redistribution Platform - Python FastAPI Backend**

## Project Overview
Building a volunteer-based waste redistribution system with 3 user types: volunteers, stores, and central base. Core workflow: stores post waste packages → volunteers claim and collect → deliver to central base for redistribution.

## Tech Stack
- **Framework**: FastAPI
- **Database**: SQLite (quick setup)
- **Auth**: JWT tokens
- **QR Codes**: Python `qrcode` library
- **AI Integration**: Anthropic Claude API (vision + text)
- **Distance**: Basic haversine formula

## Database Schema Priority
```
Users (id, email, password_hash, user_type, name, points, total_hours)
Stores (id, user_id, name, address, lat, lng)
Packages (id, store_id, volunteer_id, qr_code, label, waste_type, status, points_value, estimated_hours)
Rewards (id, name, points_cost, sponsor_store)
PointsTransactions (id, user_id, package_id, points_change, transaction_type)
```

---

## Hour-by-Hour Development Plan

### Hours 1-4: Foundation & Auth
**Priority: Get basic system running**

#### Hour 1: Project Setup
- [ ] Initialize FastAPI project
- [ ] Set up virtual environment
- [ ] Install dependencies (fastapi, sqlalchemy, jwt, qrcode, anthropic)
- [ ] Create project structure (models/, routes/, utils/)

#### Hour 2: Database Models
- [ ] Define SQLAlchemy models for all tables
- [ ] Create database initialization script
- [ ] Set up database connection and session management

#### Hour 3: Authentication System
- [ ] JWT token generation/validation utilities
- [ ] User registration endpoint (3 user types)
- [ ] Login endpoint with role-based tokens
- [ ] Password hashing (bcrypt)

#### Hour 4: Basic User Management
- [ ] User profile endpoints (GET, UPDATE)
- [ ] Role-based middleware for route protection
- [ ] Test auth flow with 3 different user types

### Hours 5-8: Core Package System
**Priority: Volunteer can claim packages**

#### Hour 5: Store Package Creation
- [ ] POST /packages endpoint (stores create packages)
- [ ] Package model with all required fields
- [ ] Basic validation for package data

#### Hour 6: QR Code Generation
- [ ] QR code generation when package is claimed
- [ ] Store QR codes as base64 or file paths
- [ ] QR code contains: package_id, volunteer_id, estimated_points

#### Hour 7: Package Claiming System
- [ ] GET /packages/available (filter by location/distance)
- [ ] POST /packages/{id}/claim (volunteer claims package)
- [ ] Update package status workflow (available → claimed)

#### Hour 8: Basic Distance & Points
- [ ] Hardcode 5-10 store locations with coordinates
- [ ] Haversine distance calculation function
- [ ] Points calculation based on distance (e.g., 10 points per km)
- [ ] Estimated hours calculation (distance / average_speed)

### Hours 9-12: Claude Integration
**Priority: Smart waste categorization**

#### Hour 9: Claude API Setup
- [ ] Anthropic API client setup
- [ ] Image upload endpoint (POST /images/analyze)
- [ ] Basic error handling for API failures

#### Hour 10: Vision-Based Labeling
- [ ] Claude vision integration for waste photos
- [ ] Auto-categorize waste types (food, recyclable, compost, etc.)
- [ ] Return suggested labels and waste type

#### Hour 11: Smart Package Descriptions
- [ ] Generate package descriptions from images
- [ ] Estimate waste weight from visual cues
- [ ] Provide handling instructions for volunteers

#### Hour 12: Fallback System
- [ ] Manual labeling when Claude fails
- [ ] Cache common results to reduce API calls
- [ ] Test vision system with various waste images

### Hours 13-16: Volunteer Features
**Priority: Complete volunteer workflow**

#### Hour 13: Package Discovery
- [ ] GET /packages/nearby (by volunteer location)
- [ ] Filter by waste type, distance, points
- [ ] Sort by distance or points value

#### Hour 14: Leaderboard System
- [ ] GET /leaderboard/volunteers (by points, deliveries)
- [ ] User stats endpoint (total points, hours, deliveries)
- [ ] Monthly/weekly leaderboard options

#### Hour 15: Rewards System
- [ ] GET /rewards (available rewards catalog)
- [ ] POST /rewards/{id}/redeem (spend points)
- [ ] Points transaction logging

#### Hour 16: Package Status Updates
- [ ] POST /packages/{id}/pickup (volunteer confirms pickup)
- [ ] Package status transitions (claimed → picked_up)
- [ ] Timestamp tracking for all status changes

### Hours 17-20: Central Base & Completion
**Priority: Complete the delivery workflow**

#### Hour 17: QR Code Scanning
- [ ] POST /packages/scan (central base scans QR)
- [ ] Decode QR code and validate package info
- [ ] Mark packages as delivered

#### Hour 18: Delivery Confirmation
- [ ] Award points to volunteer on delivery
- [ ] Update volunteer total hours
- [ ] Create points transaction record

#### Hour 19: Analytics Endpoints
- [ ] GET /analytics/waste-prevented (total weight/packages)
- [ ] GET /analytics/carbon-saved (estimated environmental impact)
- [ ] GET /analytics/store/{id}/stats (store-specific metrics)

#### Hour 20: Bonus Points System
- [ ] POST /packages/{id}/bonus (central base awards extra points)
- [ ] Admin override for points/hours
- [ ] Special recognition system

### Hours 21-24: Demo Preparation
**Priority: Ensure demo works flawlessly**

#### Hour 21: Seed Data Creation
- [ ] Create realistic test stores with addresses
- [ ] Generate sample packages with various waste types
- [ ] Create test volunteer and central base accounts

#### Hour 22: End-to-End Testing
- [ ] Complete workflow: store creates → volunteer claims → delivers
- [ ] Test QR code generation and scanning
- [ ] Verify points and hours calculations

#### Hour 23: API Documentation
- [ ] FastAPI auto-docs review and cleanup
- [ ] Create endpoint summary for frontend team
- [ ] Document auth flow and user roles

#### Hour 24: Final Polish
- [ ] Performance testing with seed data
- [ ] Error handling improvements
- [ ] Demo script preparation
- [ ] Backup plan if Claude API fails during demo

---

## Critical Success Metrics
- [ ] Volunteer can register and claim a package
- [ ] QR code generates and scans successfully
- [ ] Points are awarded correctly on delivery
- [ ] Claude vision suggests waste categories
- [ ] All 3 user types can log in and perform core actions

## Demo Flow Checklist
1. [ ] Judge registers as volunteer
2. [ ] Views available packages on map/list
3. [ ] Claims a package (QR code generates)
4. [ ] "Picks up" package (status updates)
5. [ ] "Delivers" to central base (QR scan, points awarded)
6. [ ] Views updated leaderboard and points balance

## Backup Plans
- [ ] Manual waste categorization if Claude fails
- [ ] Hardcoded distance calculations if Google Maps unavailable
- [ ] Local image storage if cloud upload fails
- [ ] SQLite file included in repo for demo

## Key Files to Create
```
app/
├── main.py (FastAPI app)
├── models.py (SQLAlchemy models)
├── auth.py (JWT utilities)
├── claude_client.py (Anthropic API)
├── routes/
│   ├── auth.py
│   ├── packages.py
│   ├── volunteers.py
│   └── analytics.py
└── utils/
    ├── qr_codes.py
    ├── distance.py
    └── points.py
```

## Environment Variables Needed
```
ANTHROPIC_API_KEY=your_key_here
JWT_SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///./hackathon.db
```

---

**Remember**: Focus on the core demo flow first. Advanced features are nice-to-have. A working end-to-end system beats a feature-rich broken