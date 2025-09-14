#!/bin/bash

# Test build script for local verification
set -e

echo "🧪 Testing ReFlourish Docker build locally..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t reflourish-test .

echo "✅ Docker image built successfully!"

# Test the build
echo "🚀 Starting container for testing..."
docker run -d --name reflourish-local-test -p 5001:5001 reflourish-test

# Wait for the app to start
echo "⏳ Waiting for application to start..."
sleep 15

# Test health endpoint
echo "🔍 Testing health endpoint..."
if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
    
    # Test main page
    echo "🔍 Testing main application page..."
    if curl -f http://localhost:5001/ > /dev/null 2>&1; then
        echo "✅ Main page loads successfully!"
        echo "🌐 Application is running at: http://localhost:5001"
        echo ""
        echo "📋 You can now:"
        echo "   1. Open http://localhost:5001 in your browser"
        echo "   2. Test the application functionality"
        echo "   3. Check logs with: docker logs reflourish-local-test"
        echo ""
        echo "🛑 To stop the container: docker stop reflourish-local-test"
        echo "🗑️  To remove the container: docker rm reflourish-local-test"
    else
        echo "❌ Main page failed to load!"
        docker logs reflourish-local-test
        docker stop reflourish-local-test
        docker rm reflourish-local-test
        exit 1
    fi
else
    echo "❌ Health check failed!"
    echo "📋 Container logs:"
    docker logs reflourish-local-test
    docker stop reflourish-local-test
    docker rm reflourish-local-test
    exit 1
fi

echo ""
echo "🎉 Local build test completed successfully!"
echo "✅ Your application is ready for AWS deployment!"
