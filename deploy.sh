#!/bin/bash

# Deployment script for Escape From Ynov
# This script prepares the application for deployment

echo "========================================="
echo "Escape From Ynov - Deployment Preparation"
echo "========================================="
echo ""

# Step 1: Clean previous build
echo "Step 1: Cleaning previous build..."
rm -rf build/
echo "✓ Build directory cleaned"
echo ""

# Step 2: Install dependencies
echo "Step 2: Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Step 3: Build React application
echo "Step 3: Building React application..."
npm run build
echo "✓ React application built"
echo ""

# Step 4: Verify build
echo "Step 4: Verifying build..."
if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "✓ Build successful - build/index.html exists"
else
    echo "✗ Build failed - build/index.html not found"
    exit 1
fi

# Check if .htaccess was copied
if [ -f "build/.htaccess" ]; then
    echo "✓ .htaccess copied to build directory"
else
    echo "! .htaccess not found in build, copying manually..."
    cp public/.htaccess build/.htaccess
    echo "✓ .htaccess copied manually"
fi
echo ""

# Step 5: Test server locally (optional)
echo "========================================="
echo "Build complete! Your application is ready for deployment."
echo ""
echo "To test locally in production mode:"
echo "  npm run prod"
echo ""
echo "To deploy to server:"
echo "  1. Upload all files to /home/myrqtsjjvm/Escape-From-Ynov"
echo "  2. SSH into server"
echo "  3. Run: source /home/myrqtsjjvm/nodevenv/Escape-From-Ynov/22/bin/activate"
echo "  4. Run: npm install --production"
echo "  5. Run: touch tmp/restart.txt"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
echo "========================================="
