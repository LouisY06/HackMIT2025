#!/bin/bash

# Force Vercel to redeploy with latest changes
echo "🔄 Forcing Vercel redeploy..."

# Create a timestamp file to force new commit
echo "Last updated: $(date)" > frontend/build-timestamp.txt

# Add and commit the timestamp
git add frontend/build-timestamp.txt
git commit -m "Force Vercel redeploy - $(date)"

# Push to trigger new deployment
git push origin main

echo "✅ New commit pushed! Vercel should now pick up the latest changes."
echo "📋 Check your Vercel dashboard for the new deployment."
