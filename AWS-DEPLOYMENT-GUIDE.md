# AWS Deployment Guide for ReFlourish

This guide will help you deploy the ReFlourish application to AWS using Docker containers, ECS (Elastic Container Service), and Application Load Balancer.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Docker** installed and running
4. **Environment Variables** configured (Google Maps API, Firebase, etc.)

## Quick Start

### Option 1: Automated Deployment (Recommended)

1. **Clone and navigate to the project:**
   ```bash
   cd /path/to/HackMIT2025-1
   ```

2. **Configure environment variables:**
   ```bash
   cp production.env .env.production
   # Edit .env.production with your actual API keys
   ```

3. **Deploy infrastructure:**
   ```bash
   aws cloudformation create-stack \
     --stack-name reflourish-infrastructure \
     --template-body file://aws-infrastructure.yaml \
     --capabilities CAPABILITY_IAM \
     --region us-east-1
   ```

4. **Build and deploy application:**
   ```bash
   ./deploy-aws.sh
   ```

### Option 2: Manual Deployment

#### Step 1: Create ECR Repository

```bash
aws ecr create-repository --repository-name reflourish-app --region us-east-1
```

#### Step 2: Build and Push Docker Image

```bash
# Build the image
docker build -t reflourish-app .

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag reflourish-app:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/reflourish-app:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/reflourish-app:latest
```

#### Step 3: Deploy Infrastructure

```bash
aws cloudformation create-stack \
  --stack-name reflourish-infrastructure \
  --template-body file://aws-infrastructure.yaml \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

#### Step 4: Update ECS Service

After the infrastructure is deployed, update the ECS service to use your image:

```bash
aws ecs update-service \
  --cluster ReFlourish-Cluster \
  --service ReFlourish-Service \
  --force-new-deployment \
  --region us-east-1
```

## Configuration

### Environment Variables

Create a `.env.production` file with the following variables:

```env
# Flask Configuration
FLASK_ENV=production
FLASK_APP=app.py

# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### API Keys Setup

1. **Google Maps API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps JavaScript API and Geocoding API
   - Create an API key
   - Restrict the key to your domain

2. **Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing
   - Enable Authentication (Email/Password)
   - Get your config from Project Settings

## Architecture Overview

The deployed application uses:

- **ECS Fargate**: Serverless container hosting
- **Application Load Balancer**: Traffic distribution and SSL termination
- **ECR**: Container image registry
- **CloudWatch**: Logging and monitoring
- **VPC**: Network isolation and security

## Monitoring and Logs

### View Application Logs

```bash
aws logs describe-log-groups --log-group-name-prefix /ecs/reflourish
aws logs tail /ecs/reflourish-app --follow
```

### Check Service Status

```bash
aws ecs describe-services --cluster ReFlourish-Cluster --services ReFlourish-Service
```

### Health Check

The application includes a health check endpoint at `/api/health` that verifies:
- Database connectivity
- Application status
- Timestamp

## Scaling

### Horizontal Scaling

Update the desired count in ECS service:

```bash
aws ecs update-service \
  --cluster ReFlourish-Cluster \
  --service ReFlourish-Service \
  --desired-count 3
```

### Vertical Scaling

Update the task definition with more CPU/memory:

```bash
aws ecs describe-task-definition --task-definition ReFlourish-Task
# Edit the task definition and register a new revision
```

## Security

### SSL/HTTPS Setup

1. **Get SSL Certificate:**
   ```bash
   aws acm request-certificate \
     --domain-name yourdomain.com \
     --validation-method DNS \
     --region us-east-1
   ```

2. **Update Load Balancer Listener:**
   - Create HTTPS listener (port 443)
   - Add SSL certificate
   - Redirect HTTP to HTTPS

### Database Security

For production, consider:
- RDS instead of SQLite
- Database encryption
- Regular backups
- Connection pooling

## Troubleshooting

### Common Issues

1. **Container won't start:**
   - Check CloudWatch logs
   - Verify environment variables
   - Ensure health check endpoint works

2. **Load balancer health checks failing:**
   - Verify security group allows port 5001
   - Check application is listening on 0.0.0.0:5001
   - Verify health check path `/api/health`

3. **Database issues:**
   - Check file permissions
   - Verify database files are in the correct location
   - Consider using RDS for production

### Useful Commands

```bash
# View ECS service events
aws ecs describe-services --cluster ReFlourish-Cluster --services ReFlourish-Service --query 'services[0].events'

# View task logs
aws logs get-log-events --log-group-name /ecs/reflourish-app --log-stream-name ecs/ReFlourish-App/[TASK-ID]

# Test health endpoint
curl http://your-load-balancer-url/api/health
```

## Cost Optimization

1. **Use Fargate Spot** for non-critical workloads
2. **Set up auto-scaling** based on CPU/memory usage
3. **Use CloudFront** for static asset caching
4. **Enable compression** in load balancer
5. **Monitor costs** with AWS Cost Explorer

## Cleanup

To remove all resources:

```bash
# Delete ECS service first
aws ecs update-service --cluster ReFlourish-Cluster --service ReFlourish-Service --desired-count 0
aws ecs delete-service --cluster ReFlourish-Cluster --service ReFlourish-Service

# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name reflourish-infrastructure

# Delete ECR repository
aws ecr delete-repository --repository-name reflourish-app --force
```

## Support

For issues or questions:
1. Check CloudWatch logs
2. Review ECS service events
3. Verify security group configurations
4. Test health check endpoint manually

## Next Steps

After successful deployment:
1. Set up custom domain
2. Configure SSL certificate
3. Set up monitoring and alerts
4. Implement CI/CD pipeline
5. Add database backups
6. Set up staging environment
