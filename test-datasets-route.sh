#!/bin/bash

# 🧪 Test Script for /datasets Route
# This script helps you verify that the new route is working

echo "🧪 Testing OpenML Next.js Routes"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Next.js is running
echo "📋 Step 1: Checking if Next.js is running..."
if curl -s http://localhost:3001 > /dev/null; then
    echo -e "${GREEN}✅ Next.js is running on port 3001${NC}"
else
    echo -e "${RED}❌ Next.js is NOT running on port 3001${NC}"
    echo "   Please run: cd app && npm run dev"
    exit 1
fi

echo ""
echo "📋 Step 2: Testing new /datasets route..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/datasets)
if [ $HTTP_CODE -eq 200 ]; then
    echo -e "${GREEN}✅ /datasets route returns 200 OK${NC}"
else
    echo -e "${RED}❌ /datasets route returns $HTTP_CODE${NC}"
    echo "   Check the browser console for errors"
fi

echo ""
echo "📋 Step 3: Testing redirect from /d/search..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/d/search)
if [ $HTTP_CODE -eq 200 ]; then
    echo -e "${GREEN}✅ /d/search route returns 200 OK${NC}"
    echo "   (Should redirect to /datasets in browser)"
else
    echo -e "${RED}❌ /d/search route returns $HTTP_CODE${NC}"
fi

echo ""
echo "📋 Step 4: Testing API endpoint..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/search)
if [ $HTTP_CODE -eq 400 ]; then
    echo -e "${YELLOW}⚠️  /api/search returns 400 (expected without data)${NC}"
    echo "   This is normal - it needs POST data"
else
    echo -e "${YELLOW}⚠️  /api/search returns $HTTP_CODE${NC}"
fi

echo ""
echo "=================================="
echo "🎯 Manual Testing Steps:"
echo "=================================="
echo ""
echo "1. Open browser: http://localhost:3001/datasets"
echo "   ✓ Should see the search page"
echo "   ✓ Should see filters on the left"
echo "   ✓ Should see search results"
echo ""
echo "2. Try searching for 'iris'"
echo "   ✓ Results should filter"
echo ""
echo "3. Open: http://localhost:3001/d/search"
echo "   ✓ Should redirect to /datasets"
echo "   ✓ URL should change in browser"
echo ""
echo "4. Open browser console (F12 → Console)"
echo "   ✓ Look for any red errors"
echo ""
echo "=================================="
echo "🐛 If you see errors:"
echo "=================================="
echo ""
echo "1. Check Elasticsearch connection:"
echo "   curl https://www.openml.org/es/"
echo ""
echo "2. Check browser console (F12)"
echo ""
echo "3. Check Next.js terminal output"
echo ""
echo "4. Read the troubleshooting guide:"
echo "   See NEXTJS_LEARNING_GUIDE.md"
echo ""

