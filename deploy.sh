#!/bin/bash

echo "🚀 Deploying Gesture & Voice-Controlled Navigation Interface"
echo "============================================================"

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🎉 Your app is now live!"
    echo "📱 Test the updated PDF loading feature"
    echo "🔗 Voice command: 'Load sample PDF'"
    echo "🔗 Button: Click 'Load Sample PDF'"
else
    echo "❌ Deployment failed!"
    echo ""
    echo "💡 Alternative deployment options:"
    echo "1. Go to https://vercel.com"
    echo "2. Connect your GitHub repository"
    echo "3. Deploy automatically"
fi
