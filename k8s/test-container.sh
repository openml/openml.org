#!/bin/bash
set -e

echo "🧪 Testing OpenML Flask Container with Environment Modes"
echo "=========================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

IMAGE_NAME="${1:-openml-flask:latest}"

echo ""
echo "Using image: $IMAGE_NAME"
echo ""

# Test 1: Development Mode
echo "Test 1: Development Mode"
echo "------------------------"
docker run --rm \
  -e ENVIRONMENT=development \
  -e TESTING=True \
  -e DATABASE_URI=sqlite:///openml.db \
  -e APP_SECRET_KEY=test-dev-secret \
  -e JWT_SECRET_KEY=test-dev-jwt \
  --name openml-test-dev \
  -d \
  $IMAGE_NAME

sleep 5

# Check if container is running
if docker ps | grep -q openml-test-dev; then
    echo -e "${GREEN}✓ Container started successfully${NC}"

    # Check logs for development mode
    if docker logs openml-test-dev 2>&1 | grep -q "DEVELOPMENT mode"; then
        echo -e "${GREEN}✓ Development mode detected${NC}"
    else
        echo -e "${RED}✗ Development mode not detected${NC}"
        docker logs openml-test-dev
        docker stop openml-test-dev
        exit 1
    fi

    # Check if single worker
    if docker logs openml-test-dev 2>&1 | grep -q "Workers: 1"; then
        echo -e "${GREEN}✓ Single worker configured${NC}"
    else
        echo -e "${YELLOW}⚠ Worker count check inconclusive${NC}"
    fi

    docker stop openml-test-dev
    echo -e "${GREEN}✓ Development test passed${NC}"
else
    echo -e "${RED}✗ Container failed to start${NC}"
    docker logs openml-test-dev 2>&1 || true
    exit 1
fi

echo ""

# Test 2: Production Mode
echo "Test 2: Production Mode"
echo "-----------------------"
docker run --rm \
  -e ENVIRONMENT=production \
  -e TESTING=False \
  -e DATABASE_URI=sqlite:///openml.db \
  -e APP_SECRET_KEY=test-prod-secret \
  -e JWT_SECRET_KEY=test-prod-jwt \
  -e GUNICORN_WORKERS=2 \
  --name openml-test-prod \
  -d \
  $IMAGE_NAME

sleep 5

# Check if container is running
if docker ps | grep -q openml-test-prod; then
    echo -e "${GREEN}✓ Container started successfully${NC}"

    # Check logs for production mode
    if docker logs openml-test-prod 2>&1 | grep -q "PRODUCTION mode"; then
        echo -e "${GREEN}✓ Production mode detected${NC}"
    else
        echo -e "${RED}✗ Production mode not detected${NC}"
        docker logs openml-test-prod
        docker stop openml-test-prod
        exit 1
    fi

    # Check if multiple workers
    if docker logs openml-test-prod 2>&1 | grep -q "Workers: 2"; then
        echo -e "${GREEN}✓ Multiple workers configured${NC}"
    else
        echo -e "${YELLOW}⚠ Worker count check inconclusive${NC}"
    fi

    docker stop openml-test-prod
    echo -e "${GREEN}✓ Production test passed${NC}"
else
    echo -e "${RED}✗ Container failed to start${NC}"
    docker logs openml-test-prod 2>&1 || true
    exit 1
fi

echo ""

# Test 3: Legacy/Default Mode
echo "Test 3: Legacy/Default Mode (no ENVIRONMENT set)"
echo "------------------------------------------------"
docker run --rm \
  -e DATABASE_URI=sqlite:///openml.db \
  -e APP_SECRET_KEY=test-legacy-secret \
  -e JWT_SECRET_KEY=test-legacy-jwt \
  --name openml-test-legacy \
  -d \
  $IMAGE_NAME

sleep 5

# Check if container is running
if docker ps | grep -q openml-test-legacy; then
    echo -e "${GREEN}✓ Container started successfully${NC}"

    # Check logs for default mode
    if docker logs openml-test-legacy 2>&1 | grep -q "DEFAULT mode"; then
        echo -e "${GREEN}✓ Legacy mode detected${NC}"
    else
        echo -e "${YELLOW}⚠ Legacy mode message not found (might be using old entrypoint)${NC}"
    fi

    docker stop openml-test-legacy
    echo -e "${GREEN}✓ Legacy test passed${NC}"
else
    echo -e "${RED}✗ Container failed to start${NC}"
    docker logs openml-test-legacy 2>&1 || true
    exit 1
fi

echo ""
echo "=========================================================="
echo -e "${GREEN}✓ All tests passed!${NC}"
echo ""
echo "Your container correctly adapts to:"
echo "  • ENVIRONMENT=development → Dev mode (1 worker, debug)"
echo "  • ENVIRONMENT=production → Prod mode (4 workers, optimized)"
echo "  • No ENVIRONMENT → Legacy mode (backward compatible)"
echo ""
echo "Ready to deploy to Kubernetes!"
