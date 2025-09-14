# 🚀 Setup Instructions

## Prerequisites
- Node.js and npm installed
- Python 3.x installed

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   touch .env
   ```

4. **Add the following to `frontend/.env`:**
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. **Start the React server:**
   ```bash
   npm start
   ```

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend/
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask server:**
   ```bash
   python3 app.py
   ```

## 🔑 Getting API Keys

### Firebase API Keys
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Go to Project Settings → General → Your apps
4. Copy the configuration values

### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create credentials → API Key
4. Restrict the key to your domain for security

## 🚨 Important Security Notes
- **Never commit `.env` files to Git**
- **Keep API keys private**
- **Use separate keys for development and production**

## 🆘 Troubleshooting
- If Google Maps doesn't load, check your API key
- If Firebase auth fails, verify your Firebase configuration
- Make sure both frontend (port 3000) and backend (port 5001) are running
