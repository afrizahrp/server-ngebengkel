#!/bin/bash

# Test Refresh Token Debug Script
# Pastikan server sudah running di http://localhost:4000

echo "=========================================="
echo "TEST REFRESH TOKEN DEBUG"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Login
echo -e "${YELLOW}Step 1: Login untuk dapat refresh token${NC}"
echo "Masukkan email:"
read EMAIL
echo "Masukkan password:"
read -s PASSWORD

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo ""
echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.'

# Extract tokens
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.refreshToken // .refresh_token // empty')
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken // .access_token // .token // empty')

if [ -z "$REFRESH_TOKEN" ] || [ "$REFRESH_TOKEN" = "null" ]; then
  echo -e "${RED}ERROR: Tidak dapat refresh token dari response${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}Refresh Token (first 50 chars): ${REFRESH_TOKEN:0:50}...${NC}"
echo ""

# Step 2: Check current state
echo -e "${YELLOW}Step 2: Check current state di database${NC}"
echo "Masukkan user_id (default: 2):"
read USER_ID
USER_ID=${USER_ID:-2}

echo ""
echo "Current hashedRefreshToken:"
echo "SELECT \"hashedRefreshToken\", \"updatedAt\" FROM \"sys_User\" WHERE id = $USER_ID;" | psql $DATABASE_URL 2>/dev/null || echo "Gunakan query manual di database"

echo ""
echo -e "${YELLOW}Step 3: Call refresh endpoint${NC}"
echo "Tekan Enter untuk continue..."
read

REFRESH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -H "X-Refresh-Token: $REFRESH_TOKEN")

HTTP_STATUS=$(echo "$REFRESH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$REFRESH_RESPONSE" | sed '/HTTP_STATUS/d')

echo ""
echo "HTTP Status: $HTTP_STATUS"
echo "Response Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"

if [ "$HTTP_STATUS" != "200" ] && [ "$HTTP_STATUS" != "201" ]; then
  echo -e "${RED}ERROR: Refresh failed with status $HTTP_STATUS${NC}"
  exit 1
fi

# Extract new tokens
NEW_REFRESH_TOKEN=$(echo "$BODY" | jq -r '.refreshToken // .refresh_token // empty')
NEW_ACCESS_TOKEN=$(echo "$BODY" | jq -r '.accessToken // .access_token // .token // empty')

echo ""
echo -e "${GREEN}New Refresh Token (first 50 chars): ${NEW_REFRESH_TOKEN:0:50}...${NC}"

# Step 4: Check updated state
echo ""
echo -e "${YELLOW}Step 4: Check updated state di database${NC}"
echo "Updated hashedRefreshToken:"
echo "SELECT \"hashedRefreshToken\", \"updatedAt\" FROM \"sys_User\" WHERE id = $USER_ID;" | psql $DATABASE_URL 2>/dev/null || echo "Gunakan query manual di database"

echo ""
echo -e "${YELLOW}Step 5: Check server logs${NC}"
echo "Periksa console server untuk logs:"
echo "  - [RefreshToken] Refresh endpoint called for user: ..."
echo "  - [RefreshToken] Updating user hashedRefreshToken for user: ..."
echo "  - [RefreshToken] User updated successfully. UpdatedAt: ..."

echo ""
echo "=========================================="
echo "TEST COMPLETE"
echo "=========================================="

