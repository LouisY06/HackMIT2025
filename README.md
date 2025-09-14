# Reflourish Platform

A gamified reverse logistics platform that transforms food waste into community impact. The platform connects volunteers, stores, and food banks to reduce waste while rewarding community service.

## 🎯 Project Overview

**Reflourish** is a sustainability-focused platform that addresses food waste through a three-tier system:

- **Volunteers** (High School Students + General Public): Earn community service hours and points by collecting waste packages
- **Stores** (Restaurants, Groceries, Bakeries): Efficiently dispose of excess food while reducing waste costs and improving sustainability image
- **Food Banks** (Central Distribution Hubs): Receive, sort, and redistribute collected items to appropriate destinations

## 🏗️ System Architecture

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx          # Main landing page with role selection
│   │   ├── StoreLogin.tsx           # Store partner login with Firebase auth
│   │   ├── StoreDashboard.tsx       # Store partner dashboard (placeholder)
│   │   ├── VolunteerLogin.tsx       # Volunteer login (placeholder)
│   │   └── FoodBankLogin.tsx        # Food bank login (placeholder)
│   ├── config/
│   │   └── firebase.ts              # Firebase configuration
│   ├── App.tsx                      # Main app with routing
│   └── index.tsx                    # App entry point
├── package.json                     # Dependencies and scripts
└── .env                            # Firebase configuration (user-created)
```

### Backend Structure
```
backend/
└── (To be implemented)
```

## 🚀 Current Implementation Status

### ✅ Completed Features

#### Landing Page (`/`)
- **Role Selection Interface**: Three cards for Volunteer Courier, Store Partner, and Food Bank Partner
- **Impact Metrics Display**: Shows CO₂ prevented, meals provided, and cost savings
- **Responsive Design**: Works on mobile and desktop
- **Navigation**: Routes to respective login pages

#### Store Partner Login (`/store`)
- **Firebase Authentication**: 
  - Email/Password sign-up and sign-in
  - Google OAuth integration
  - Toggle between sign-in and sign-up modes
- **Professional UI**: Blue gradient header with benefits list
- **Store Benefits Display**: Save costs, improve sustainability, support community, enhance reputation
- **Form Validation**: Error handling and loading states
- **Navigation**: Routes to store dashboard after authentication

#### Routing System
- `/` - Landing page
- `/volunteer` - Volunteer login (placeholder)
- `/store` - Store partner login
- `/store/dashboard` - Store dashboard (placeholder)
- `/foodbank` - Food bank login (placeholder)

### 🔄 In Progress
- Firebase Authentication setup (needs API keys)
- Store dashboard implementation
- Volunteer and Food Bank login pages

### 📋 Planned Features

#### Volunteer UI (`/volunteer/*`)
- Dashboard with points balance and rank display
- Interactive Google Maps for package discovery
- Leaderboard system
- QR code scanner for pickup confirmation
- Rewards store with partner discounts
- Community service hours tracking

#### Store UI (`/store/*`)
- Package management system
- Claude Vision integration for waste categorization
- QR code generator for packages
- Volunteer coordination tools
- Analytics and sustainability metrics
- Cost savings calculator

#### Food Bank UI (`/foodbank/*`)
- Package processing with QR scanner
- Volunteer management system
- Sorting and distribution tools
- Impact reporting
- Community service hour validation

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for component library
- **React Router** for navigation
- **Firebase Auth** for authentication
- **Google Maps API** (planned)

### Backend (Planned)
- **Python** with Flask/FastAPI
- **Firebase Firestore** for database
- **Claude Vision API** for image analysis
- **QR Code generation/scanning**

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Authentication enabled

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. Start development server:
   ```bash
   npm start
   ```

### Firebase Configuration
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password and Google sign-in
3. Add a web app and copy the configuration values
4. Update the `.env` file with your Firebase config

## 🎮 Demo Flow

### Three-Device Demo Setup
1. **Tablet 1**: Store interface - Create package with Claude vision
2. **Phone**: Volunteer interface - Claim package, show map navigation
3. **Tablet 2**: Food bank interface - Scan QR, award points

### Current Demo Capabilities
- Landing page with role selection
- Store partner login with Firebase authentication
- Google OAuth and email/password authentication
- Navigation between different user interfaces

## 💡 Key Features

### Gamification Elements
- **Points System**: Volunteers earn points for deliveries
- **Leaderboards**: Monthly/weekly/all-time rankings
- **Achievement Badges**: Recognition for milestones
- **Community Service Hours**: Automatic tracking and certification

### Business Model
- **Store Partnerships**: Reduced waste disposal costs
- **Volunteer Rewards**: Partner store discounts
- **Sustainability Reporting**: Corporate impact metrics
- **Community Impact**: Food rescue and waste diversion

### Technical Highlights
- **Multi-role Authentication**: Same email can have multiple account types
- **Real-time Updates**: Package status changes and notifications
- **Mobile Optimization**: Responsive design for all devices
- **QR Code Integration**: Seamless pickup and delivery tracking

## 📊 Impact Metrics

The platform tracks and displays:
- **Environmental Impact**: CO₂ emissions prevented, waste diverted
- **Social Impact**: Meals provided to communities
- **Economic Impact**: Cost savings for stores and disposal companies
- **Community Engagement**: Volunteer hours and participation

## 🤝 Contributing

This is a HackMIT 2025 project focused on demonstrating the complete user journey from store to volunteer to food bank. The platform showcases how technology can gamify sustainability efforts and create positive community impact.

## 📝 License

This project is developed for HackMIT 2025. All rights reserved.

---

**Built with ❤️ for HackMIT 2025** - Transforming food waste into community impact through gamified reverse logistics.
