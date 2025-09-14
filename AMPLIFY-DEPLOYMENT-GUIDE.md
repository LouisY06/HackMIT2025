# AWS Amplify Deployment Guide for ReFlourish

This guide will help you deploy the ReFlourish application using AWS Amplify, which provides a simpler deployment process with built-in CI/CD.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **GitHub Repository** (recommended) or GitLab/Bitbucket
3. **Environment Variables** configured (Google Maps API, Firebase, etc.)

## Deployment Options

### Option 1: Full-Stack Amplify (Recommended for Simplicity)

This approach uses Amplify for the frontend and Amplify API for the backend.

### Option 2: Frontend Only on Amplify + Separate Backend

This approach uses Amplify for the frontend and deploys the Flask backend separately.

## Option 1: Full-Stack Amplify Deployment

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit for Amplify deployment"
   git push origin main
   ```

### Step 2: Create Amplify App

1. **Go to AWS Amplify Console:**
   - Visit [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"

2. **Connect Repository:**
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Authorize AWS Amplify to access your repository
   - Select your repository
   - Choose the branch (usually `main` or `master`)

3. **Configure Build Settings:**
   - Amplify will auto-detect your `amplify.yml` file
   - If not detected, use these build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "Installing frontend dependencies..."
        - cd frontend && npm ci
    build:
      commands:
        - echo "Building frontend..."
        - cd frontend && npm run build
  artifacts:
    baseDirectory: frontend/build
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

### Step 3: Set Environment Variables

In the Amplify console, go to **App settings** → **Environment variables** and add:

```
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### Step 4: Add Backend API

1. **In Amplify Console:**
   - Go to your app
   - Click "Backend environments"
   - Click "Add backend environment"

2. **Configure API:**
   - Choose "REST API"
   - Add the following endpoints:

```yaml
# Example API configuration
/api/packages:
  GET: packages#list
  POST: packages#create

/api/packages/{id}:
  GET: packages#get
  PUT: packages#update
  DELETE: packages#delete

/api/health:
  GET: health#check
```

3. **Deploy Backend:**
   - Click "Deploy" to create the backend API
   - This will create Lambda functions and API Gateway

### Step 5: Update Frontend API Calls

Update your frontend to use the Amplify API endpoints:

```typescript
// Instead of http://localhost:5001/api/...
// Use the Amplify API endpoint
const API_URL = process.env.REACT_APP_API_URL || 'https://your-api-id.execute-api.region.amazonaws.com/prod';

// Example API call
const response = await fetch(`${API_URL}/api/packages`);
```

## Option 2: Frontend Only + Separate Backend

### Step 1: Deploy Frontend to Amplify

Follow steps 1-3 from Option 1, but skip the backend configuration.

### Step 2: Deploy Backend Separately

Choose one of these options:

#### A. Deploy to AWS Lambda + API Gateway

1. **Install AWS SAM CLI:**
   ```bash
   pip install aws-sam-cli
   ```

2. **Create SAM template:**
   ```yaml
   # template.yaml
   AWSTemplateFormatVersion: '2010-09-09'
   Transform: AWS::Serverless-2016-10-31
   
   Resources:
     ReFlourishAPI:
       Type: AWS::Serverless::Function
       Properties:
         CodeUri: backend/
         Handler: app.lambda_handler
         Runtime: python3.9
         Events:
           Api:
             Type: Api
             Properties:
               Path: /{proxy+}
               Method: ANY
   ```

3. **Deploy:**
   ```bash
   sam build
   sam deploy --guided
   ```

#### B. Deploy to AWS Elastic Beanstalk

1. **Install EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Initialize Elastic Beanstalk:**
   ```bash
   cd backend
   eb init
   eb create reflourish-backend
   eb deploy
   ```

#### C. Use the Docker Deployment

Use the Docker configuration from the previous guide with ECS or EC2.

## Environment Configuration

### Frontend Environment Variables (in Amplify Console)

```
REACT_APP_GOOGLE_MAPS_API_KEY=your-key
REACT_APP_FIREBASE_API_KEY=your-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_API_URL=https://your-api-endpoint.com
```

### Backend Environment Variables

If using separate backend deployment:

```
FLASK_ENV=production
DATABASE_URL=your-database-url
SECRET_KEY=your-secret-key
```

## Custom Domain Setup

1. **In Amplify Console:**
   - Go to **Domain management**
   - Click **Add domain**
   - Enter your domain name
   - Follow DNS configuration instructions

2. **SSL Certificate:**
   - Amplify automatically provisions SSL certificates
   - DNS propagation may take 24-48 hours

## CI/CD with Amplify

Amplify automatically provides:

- **Automatic deployments** on git push
- **Preview deployments** for pull requests
- **Branch-based environments**
- **Build logs and monitoring**

### Branch-based Environments

1. **Production:** `main` branch
2. **Staging:** `staging` branch
3. **Development:** `develop` branch

## Monitoring and Logs

### View Build Logs

1. **In Amplify Console:**
   - Go to your app
   - Click on build number
   - View detailed logs

### Application Monitoring

1. **CloudWatch Integration:**
   - Automatic log aggregation
   - Performance monitoring
   - Error tracking

## Cost Optimization

### Amplify Pricing

- **Build minutes:** $0.01 per minute
- **Hosting:** $0.15 per GB served
- **Data transfer:** $0.15 per GB

### Optimization Tips

1. **Use caching** for static assets
2. **Optimize images** before upload
3. **Enable compression**
4. **Use CDN** for global distribution

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check build logs in Amplify console
   - Verify environment variables
   - Check Node.js version compatibility

2. **API Connection Issues:**
   - Verify CORS configuration
   - Check API endpoint URLs
   - Verify environment variables

3. **Database Issues:**
   - Use managed database services (RDS)
   - Check connection strings
   - Verify security groups

### Useful Commands

```bash
# Check build status
aws amplify get-app --app-id your-app-id

# View build logs
aws amplify get-job --app-id your-app-id --branch-name main --job-id your-job-id

# List environment variables
aws amplify get-app --app-id your-app-id --query 'app.environmentVariables'
```

## Security Best Practices

1. **Environment Variables:**
   - Never commit API keys to git
   - Use Amplify environment variables
   - Rotate keys regularly

2. **API Security:**
   - Enable CORS properly
   - Use HTTPS only
   - Implement rate limiting

3. **Database Security:**
   - Use managed databases
   - Enable encryption
   - Regular backups

## Migration from Development

### Update API Endpoints

Replace all `http://localhost:5001` with your production API URL:

```typescript
// Before
const API_BASE = 'http://localhost:5001';

// After
const API_BASE = process.env.REACT_APP_API_URL || 'https://your-api-domain.com';
```

### Update CORS Configuration

In your backend, update CORS settings:

```python
# In app.py
CORS(app, origins=[
    "https://your-amplify-domain.amplifyapp.com",
    "https://your-custom-domain.com"
])
```

## Next Steps

After successful deployment:

1. **Set up custom domain**
2. **Configure SSL certificate**
3. **Set up monitoring and alerts**
4. **Implement staging environment**
5. **Set up database backups**
6. **Configure CI/CD pipelines**

## Support

For issues:
1. Check Amplify build logs
2. Verify environment variables
3. Test API endpoints manually
4. Check AWS CloudWatch logs

## Quick Start Commands

```bash
# Option 1: Amplify CLI (if using Amplify CLI)
amplify init
amplify add hosting
amplify publish

# Option 2: Manual (recommended)
# 1. Push to GitHub
# 2. Create app in Amplify Console
# 3. Connect repository
# 4. Deploy
```

**Amplify provides the easiest deployment path with automatic CI/CD, custom domains, and built-in monitoring!** 🚀
