#!/bin/bash

echo "Setting up Nutrient DWS Word Add-in..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js version 18 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version $(node -v) is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm is installed"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Generate SSL certificates
echo ""
echo "Generating SSL certificates for development..."
./generate-certs.sh

if [ $? -eq 0 ]; then
    echo "✅ SSL certificates generated successfully"
else
    echo "❌ Failed to generate SSL certificates"
    exit 1
fi

# Validate manifest
echo ""
echo "Validating manifest file..."
npm run validate

if [ $? -eq 0 ]; then
    echo "✅ Manifest file is valid"
else
    echo "❌ Manifest file validation failed"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Get a Nutrient DWS API key from https://dashboard.nutrient.io/sign_up/"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Run 'npm run sideload' to load the add-in in Word"
echo "4. Open Word and look for the 'Document Processor' button in the Home tab"
echo ""
echo "For more information, see the README.md file." 