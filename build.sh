#!/bin/bash

# Build script for AWS deployment
set -e

echo "🚀 Building ReFlourish for AWS deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t reflourish-app .

# Test the build locally
echo "🧪 Testing the build locally..."
docker run -d --name reflourish-test -p 5001:5001 reflourish-app

# Wait for the app to start
echo "⏳ Waiting for application to start..."
sleep 10

# Test health endpoint
if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
else
    echo "❌ Health check failed!"
    docker logs reflourish-test
    docker stop reflourish-test
    docker rm reflourish-test
    exit 1
fi

# Stop test container
docker stop reflourish-test
docker rm reflourish-test

echo "✅ Build completed successfully!"
echo "📋 Next steps:"
echo "   1. Tag the image for AWS ECR: docker tag reflourish-app:latest <account-id>.dkr.ecr.<region>.amazonaws.com/reflourish-app:latest"
echo "   2. Push to ECR: docker push <account-id>.dkr.ecr.<region>.amazonaws.com/reflourish-app:latest"
echo "   3. Deploy to ECS or EC2"
