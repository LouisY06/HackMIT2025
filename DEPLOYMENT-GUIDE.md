# 🚀 ReFlourish Deployment Guide

Deploy your React + Flask app to **Vercel** (frontend) + **Railway** (backend) in under 10 minutes!

## 🎯 Why This Approach?

- ✅ **Vercel**: Best-in-class React hosting with automatic deployments
- ✅ **Railway**: Simple Flask backend deployment with databases
- ✅ **Automatic CI/CD**: Deploy on every git push
- ✅ **Free tiers** available for both
- ✅ **Custom domains** supported
- ✅ **Much simpler** than AWS Amplify

## 🚀 Quick Deployment (5 minutes)

### Step 1: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Railway will auto-detect it's a Python app**
6. **Add environment variables:**
   ```
   FLASK_ENV=production
   DATABASE_URL=sqlite:///app/backend/packages.db
   ```
7. **Deploy!** Railway will give you a URL like `https://your-app.railway.app`

### Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Click "New Project" → "Import Git Repository"**
4. **Select your repository**
5. **Configure build settings:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. **Add environment variables:**
   ```
   REACT_APP_API_URL=https://your-railway-url.railway.app
   REACT_APP_GOOGLE_MAPS_API_KEY=your-key
   REACT_APP_FIREBASE_API_KEY=your-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```
7. **Deploy!**

## 🔧 Configuration Files

### `railway.toml` (Backend Configuration)
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "cd backend && python app.py"
healthcheckPath = "/api/health"
healthcheckTimeout = 100
restartPolicyType = "on_failure"

[environments.production]
DATABASE_URL = "sqlite:///app/backend/packages.db"
FLASK_ENV = "production"
```

### `vercel.json` (Frontend Configuration)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-url.railway.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/build/$1"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-backend-url.railway.app"
  }
}
```

## 🌐 Custom Domain Setup

### Vercel (Frontend):
1. Go to your Vercel project
2. Click "Domains"
3. Add your domain
4. Follow DNS instructions

### Railway (Backend):
1. Go to your Railway project
2. Click "Settings" → "Domains"
3. Add custom domain
4. Update Vercel environment variable

## 💰 Cost

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Railway**: Free tier includes $5 credit/month
- **Total**: ~$0/month for small apps

## 🔄 Automatic Deployments

Both platforms automatically deploy when you push to GitHub:
- Push to `main` → Production deployment
- Push to `develop` → Preview deployment
- Pull requests → Preview deployments

## 📊 Monitoring

- **Vercel**: Built-in analytics and performance monitoring
- **Railway**: Application logs and metrics
- **Both**: Real-time deployment status

## 🛠️ Troubleshooting

### Backend Issues:
1. Check Railway logs
2. Verify environment variables
3. Test health endpoint: `https://your-app.railway.app/api/health`

### Frontend Issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test API calls in browser console

## 🎉 Benefits Over AWS Amplify

- ✅ **Simpler setup** - no complex configuration
- ✅ **Better error messages** - clear build logs
- ✅ **Automatic optimization** - Vercel optimizes React apps
- ✅ **Better performance** - global CDN
- ✅ **Easier debugging** - straightforward logs
- ✅ **More reliable** - proven platforms

## 📋 Migration Checklist

- [ ] Create Railway account and deploy backend
- [ ] Create Vercel account and deploy frontend
- [ ] Update API URLs in frontend
- [ ] Test full application
- [ ] Set up custom domains (optional)
- [ ] Configure environment variables
- [ ] Test automatic deployments

## 🚀 Next Steps

1. **Try Railway first** - deploy your backend in 2 minutes
2. **Then Vercel** - deploy your frontend in 2 minutes
3. **Test the full app** - should work immediately
4. **Set up custom domains** - if desired

**This approach is much more reliable and easier than Amplify!** 🎉

## 📞 Support

If you run into issues:
1. Check the platform logs (Railway/Vercel)
2. Verify environment variables are set correctly
3. Test the health endpoint
4. Make sure all API keys are valid

Both platforms have excellent documentation and support!
