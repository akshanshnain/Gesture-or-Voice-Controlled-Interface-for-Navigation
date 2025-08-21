#!/bin/bash

echo "🎯 Setting up Gesture or Voice-Controlled Interface for Navigation"
echo "================================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/types
mkdir -p cypress/e2e
mkdir -p cypress/support

echo "✅ Directories created"

# Check if camera and microphone permissions are available
echo "🔍 Checking browser permissions..."
echo "Note: You'll need to grant camera and microphone permissions when running the app."

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm start"
echo ""
echo "To run tests:"
echo "  npm test"
echo ""
echo "To run accessibility tests:"
echo "  npm run test:accessibility"
echo ""
echo "To run Cypress tests:"
echo "  npm run cypress:open"
echo ""
echo "Happy coding! 🚀"
