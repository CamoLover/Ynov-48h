#!/bin/bash

echo "========================================="
echo "Escape From Ynov - Diagnostic Tool"
echo "========================================="
echo ""

# Check current directory
echo "1. Current Directory:"
pwd
echo ""

# Check if build exists
echo "2. Build Directory:"
if [ -d "build" ]; then
    echo "✓ build/ directory exists"
    if [ -f "build/index.html" ]; then
        echo "✓ build/index.html exists"
    else
        echo "✗ build/index.html NOT FOUND"
    fi
    if [ -f "build/.htaccess" ]; then
        echo "✓ build/.htaccess exists"
    else
        echo "! build/.htaccess NOT FOUND (will be copied)"
        cp public/.htaccess build/.htaccess 2>/dev/null && echo "✓ Copied .htaccess to build/"
    fi
else
    echo "✗ build/ directory NOT FOUND - run 'npm run build' first"
fi
echo ""

# Check server files
echo "3. Server Files:"
[ -f "server.js" ] && echo "✓ server.js exists" || echo "✗ server.js NOT FOUND"
[ -f "app.js" ] && echo "✓ app.js exists" || echo "✗ app.js NOT FOUND"
[ -f ".htaccess" ] && echo "✓ .htaccess exists" || echo "✗ .htaccess NOT FOUND"
echo ""

# Check node_modules
echo "4. Dependencies:"
if [ -d "node_modules" ]; then
    echo "✓ node_modules/ exists"
    [ -d "node_modules/express" ] && echo "  ✓ express installed" || echo "  ✗ express NOT installed"
    [ -d "node_modules/socket.io" ] && echo "  ✓ socket.io installed" || echo "  ✗ socket.io NOT installed"
else
    echo "✗ node_modules/ NOT FOUND - run 'npm install' first"
fi
echo ""

# Check Node.js version
echo "5. Node.js Version:"
if command -v node &> /dev/null; then
    node --version
else
    echo "! Node.js not found in PATH"
    echo "  Make sure to run:"
    echo "  source /home/myrqtsjjvm/nodevenv/Escape-From-Ynov/22/bin/activate"
fi
echo ""

# Check environment
echo "6. Environment:"
echo "NODE_ENV: ${NODE_ENV:-not set (will default to development)}"
echo "PORT: ${PORT:-not set (will default to 3001)}"
echo ""

# Try to test server
echo "7. Server Test:"
echo "Testing if server.js can be loaded..."
if command -v node &> /dev/null; then
    node -e "try { require('./server.js'); console.log('✓ server.js loads successfully'); } catch(e) { console.log('✗ Error loading server.js:', e.message); }"
else
    echo "! Cannot test - Node.js not in PATH"
fi
echo ""

echo "========================================="
echo "Diagnostic Complete"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. If build/ is missing: npm run build"
echo "2. If node_modules/ is missing: npm install"
echo "3. If you see errors above, fix them before deploying"
echo "4. To test server: node server.js"
echo ""
