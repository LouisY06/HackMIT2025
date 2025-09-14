#!/bin/bash

# AWS deployment script for ReFlourish
set -e

# Configuration - UPDATE THESE VALUES
AWS_REGION="us-east-1"
ECR_REPOSITORY="reflourish-app"
ECS_CLUSTER="reflourish-cluster"
ECS_SERVICE="reflourish-service"
ECS_TASK_DEFINITION="reflourish-task"

echo "🚀 Deploying ReFlourish to AWS..."

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "📋 AWS Account ID: $AWS_ACCOUNT_ID"

# Build and push to ECR
echo "📦 Building and pushing to ECR..."

# Create ECR repository if it doesn't exist
aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION 2>/dev/null || \
aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build, tag and push the image
docker build -t $ECR_REPOSITORY .
docker tag $ECR_REPOSITORY:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest

echo "✅ Image pushed to ECR successfully!"

# Update ECS service (if it exists)
if aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION &> /dev/null; then
    echo "🔄 Updating ECS service..."
    aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment --region $AWS_REGION
    echo "✅ ECS service updated!"
else
    echo "⚠️  ECS service not found. Please create it manually or use the CloudFormation template."
fi

echo "🎉 Deployment completed!"
echo "📋 Your application should be available at the load balancer URL"
echo "🔍 Check the ECS console for the service status and logs"
