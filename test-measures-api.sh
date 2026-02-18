#!/bin/bash

# Test the /api/measures endpoint directly
echo "Testing /api/measures API endpoint..."
echo ""

curl -X POST http://localhost:3050/api/measures \
  -H "Content-Type: application/json" \
  -d '{
    "measureType": "evaluation_measure",
    "sort": "name",
    "dir": "asc"
  }' | jq '.'
