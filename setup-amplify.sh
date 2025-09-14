#!/bin/bash

# AWS Amplify Setup Script for ReFlourish
set -e

echo "🚀 Setting up ReFlourish for AWS Amplify deployment..."

# Check if we're in the right directory
if [ ! -f "amplify.yml" ]; then
    echo "❌ amplify.yml not found. Please run this script from the project root directory."
    exit 1
fi

echo "✅ Found amplify.yml configuration"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for Amplify deployment"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check for environment variables template
if [ -f "production.env" ]; then
    echo "📋 Environment variables template found: production.env"
    echo "📝 Please copy this to .env.local and fill in your values:"
    echo "   cp production.env .env.local"
    echo "   # Edit .env.local with your API keys"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git remote add origin https://github.com/yourusername/your-repo.git"
echo "   git push -u origin main"
echo ""
echo "2. Go to AWS Amplify Console:"
echo "   https://console.aws.amazon.com/amplify/"
echo ""
echo "3. Create new app → Host web app"
echo "4. Connect your GitHub repository"
echo "5. Amplify will auto-detect the amplify.yml configuration"
echo "6. Add environment variables in the Amplify console:"
echo "   - REACT_APP_GOOGLE_MAPS_API_KEY"
echo "   - REACT_APP_FIREBASE_API_KEY"
echo "   - REACT_APP_FIREBASE_AUTH_DOMAIN"
echo "   - REACT_APP_FIREBASE_PROJECT_ID"
echo "   - REACT_APP_FIREBASE_STORAGE_BUCKET"
echo "   - REACT_APP_FIREBASE_MESSAGING_SENDER_ID"
echo "   - REACT_APP_FIREBASE_APP_ID"
echo ""
echo "7. Deploy!"
echo ""
echo "📖 For detailed instructions, see: AMPLIFY-DEPLOYMENT-GUIDE.md"
echo ""
echo "✅ Amplify setup preparation completed!"
