#!/bin/bash

# 🔍 Quick Diagnostic Script
# Helps identify the cause of 500 errors

echo "🔍 OpenML Elasticsearch Diagnostic"
echo "==================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test 1: Check if Next.js is running
echo "📋 Test 1: Next.js Server"
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Next.js is running on port 3001${NC}"
else
    echo -e "${RED}❌ Next.js is NOT running${NC}"
    echo "   Run: cd app && npm run dev"
    exit 1
fi
echo ""

# Test 2: Check Elasticsearch connection
echo "📋 Test 2: Elasticsearch Connection"
if curl -s https://www.openml.org/es/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Elasticsearch is reachable${NC}"
    ES_INFO=$(curl -s https://www.openml.org/es/)
    echo "   Cluster: $(echo $ES_INFO | grep -o '"cluster_name":"[^"]*"' | cut -d'"' -f4)"
    echo "   Version: $(echo $ES_INFO | grep -o '"number":"[^"]*"' | head -1 | cut -d'"' -f4)"
else
    echo -e "${RED}❌ Cannot reach Elasticsearch${NC}"
    echo "   URL: https://www.openml.org/es/"
    echo "   Check internet connection or VPN"
fi
echo ""

# Test 3: Check data index
echo "📋 Test 3: Data Index Query"
ES_SEARCH=$(curl -s -X POST "https://www.openml.org/es/data/_search" \
  -H "Content-Type: application/json" \
  -d '{"size":1,"query":{"match_all":{}}}')

if echo "$ES_SEARCH" | grep -q '"hits"'; then
    TOTAL=$(echo $ES_SEARCH | grep -o '"total":[0-9]*' | head -1 | grep -o '[0-9]*')
    if [ -z "$TOTAL" ]; then
        TOTAL=$(echo $ES_SEARCH | grep -o '"value":[0-9]*' | head -1 | grep -o '[0-9]*')
    fi
    echo -e "${GREEN}✅ Can query 'data' index${NC}"
    echo "   Total datasets: $TOTAL"
else
    echo -e "${RED}❌ Cannot query 'data' index${NC}"
    echo "   Response: $(echo $ES_SEARCH | head -c 100)..."
fi
echo ""

# Test 4: Check Next.js test endpoint
echo "📋 Test 4: Next.js Test Endpoint"
TEST_RESULT=$(curl -s http://localhost:3001/api/test-es)

if echo "$TEST_RESULT" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Test endpoint working${NC}"
    echo "   Visit: http://localhost:3001/api/test-es"
else
    echo -e "${RED}❌ Test endpoint failed${NC}"
    if echo "$TEST_RESULT" | grep -q '"error"'; then
        ERROR_MSG=$(echo $TEST_RESULT | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
        echo "   Error: $ERROR_MSG"
    fi
fi
echo ""

# Test 5: Check package installation
echo "📋 Test 5: Required Packages"
cd app > /dev/null 2>&1
if npm list @elastic/search-ui-elasticsearch-connector > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Elasticsearch connector installed${NC}"
else
    echo -e "${RED}❌ Elasticsearch connector missing${NC}"
    echo "   Run: npm install @elastic/search-ui-elasticsearch-connector"
fi

if npm list @elastic/react-search-ui > /dev/null 2>&1; then
    echo -e "${GREEN}✅ React Search UI installed${NC}"
else
    echo -e "${RED}❌ React Search UI missing${NC}"
    echo "   Run: npm install @elastic/react-search-ui"
fi
cd - > /dev/null 2>&1
echo ""

# Summary
echo "==================================="
echo "🎯 Summary & Next Steps"
echo "==================================="
echo ""
echo "1. Open your browser to:"
echo -e "   ${BLUE}http://localhost:3001/api/test-es${NC}"
echo ""
echo "2. Check the Next.js terminal output for error messages"
echo ""
echo "3. Open browser console (F12) and check for errors"
echo ""
echo "4. If all tests pass but still getting 500 error:"
echo "   - Clear browser cache (Ctrl+Shift+Delete)"
echo "   - Kill Next.js (Ctrl+C) and restart: npm run dev"
echo "   - Check app/src/search_configs/dataConfig.js"
echo ""
echo "5. Read detailed guide:"
echo -e "   ${BLUE}cat ERROR_ANALYSIS.md${NC}"
echo ""
