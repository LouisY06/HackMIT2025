# AWS Amplify Troubleshooting Guide

## Common Build Issues and Solutions

### Issue: "cd: frontend: No such file or directory"

**Error Message:**
```
/root/.rvm/scripts/extras/bash_zsh_support/chpwd/function.sh: line 5: cd: frontend: No such file or directory
!!! Build failed
!!! Error: Command failed with exit code 1
```

**Possible Causes:**
1. Repository structure doesn't match expected layout
2. Amplify is running from wrong directory
3. Frontend directory not pushed to repository

**Solutions:**

#### Solution 1: Verify Repository Structure
Make sure your repository has this structure:
```
your-repo/
├── frontend/
│   ├── package.json
│   ├── src/
│   └── public/
├── backend/
└── amplify.yml
```

#### Solution 2: Use Absolute Paths in amplify.yml
Replace the current `amplify.yml` with this version:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "=== PreBuild Phase ==="
        - echo "Current working directory:"
        - pwd
        - echo "Directory contents:"
        - ls -la
        - echo "Checking frontend directory:"
        - test -d frontend && echo "✅ Frontend directory exists" || echo "❌ Frontend directory missing"
        - echo "Navigating to frontend directory..."
        - cd frontend
        - echo "Frontend directory contents:"
        - ls -la
        - echo "Installing dependencies..."
        - npm ci
    build:
      commands:
        - echo "=== Build Phase ==="
        - echo "Building React application..."
        - cd frontend
        - npm run build
        - echo "Build completed. Checking build output:"
        - ls -la build/
  artifacts:
    baseDirectory: frontend/build
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

#### Solution 3: Alternative Directory Structure
If your frontend code is in the root directory (not in a `frontend/` subdirectory), use this configuration:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "Installing dependencies..."
        - npm ci
    build:
      commands:
        - echo "Building application..."
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Solution 4: Check Git Repository
Ensure your frontend directory is committed to git:

```bash
git add frontend/
git commit -m "Add frontend directory"
git push origin main
```

### Issue: "npm ci" fails

**Error Message:**
```
npm error The `npm ci` command can only install with an existing package-lock.json
```

**Solution:**
Make sure `package-lock.json` exists in the frontend directory:

```bash
cd frontend
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push origin main
```

### Issue: Build Script Not Found

**Error Message:**
```
npm error missing script: build
```

**Solution:**
Ensure your `frontend/package.json` has a build script:

```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

### Issue: Environment Variables Not Working

**Error Message:**
```
REACT_APP_GOOGLE_MAPS_API_KEY is undefined
```

**Solution:**
Add environment variables in Amplify Console:
1. Go to your Amplify app
2. Click "App settings" → "Environment variables"
3. Add your environment variables:
   - `REACT_APP_GOOGLE_MAPS_API_KEY`
   - `REACT_APP_FIREBASE_API_KEY`
   - etc.

### Issue: CORS Errors

**Error Message:**
```
Access to fetch at 'http://localhost:5001' from origin 'https://your-app.amplifyapp.com' has been blocked by CORS policy
```

**Solution:**
Update your backend CORS configuration:

```python
# In backend/app.py
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "https://your-app.amplifyapp.com",
    "https://your-custom-domain.com"
])
```

## Debugging Steps

### Step 1: Check Build Logs
1. Go to Amplify Console
2. Click on your app
3. Click on the failed build
4. Review the build logs for specific error messages

### Step 2: Test Locally
Test your build locally to ensure it works:

```bash
cd frontend
npm install
npm run build
```

### Step 3: Verify Repository Structure
Check that your repository has the expected structure:

```bash
git clone your-repo-url
cd your-repo
ls -la
ls -la frontend/
```

### Step 4: Check Environment Variables
Verify environment variables are set in Amplify Console.

## Quick Fixes

### Fix 1: Update amplify.yml
Replace your current `amplify.yml` with the debugging version above and redeploy.

### Fix 2: Restart Build
In Amplify Console, click "Redeploy this version" to retry the build.

### Fix 3: Check Node.js Version
Ensure your `frontend/package.json` specifies a compatible Node.js version:

```json
{
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
```

## Getting Help

If issues persist:
1. Check AWS Amplify documentation
2. Review build logs carefully
3. Test locally first
4. Verify repository structure matches expected layout
5. Ensure all dependencies are committed to git

## Common Repository Structures

### Structure 1: Frontend in subdirectory (Current)
```
repo/
├── frontend/
│   ├── package.json
│   ├── src/
│   └── public/
├── backend/
└── amplify.yml
```

### Structure 2: Frontend in root
```
repo/
├── package.json
├── src/
├── public/
├── backend/
└── amplify.yml
```

Choose the appropriate `amplify.yml` configuration based on your structure.
