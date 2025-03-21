#!/bin/bash

# Set your API base URL
BASE_URL="http://localhost:8080" # Change this if hosted elsewhere

---- 1. Call /sendbtc ----
echo "Calling /btc/sendbtc endpoint..."
curl -X POST "$BASE_URL/btc/sendbtc" \
  -H "Content-Type: application/json" \
  -d '{
    "recieverAddress": "n1fWbd9xo4NaHKhYqnNBXkrFdrRSbTNKHo",
    "amountToSend": 0.0000001
  }'
echo -e "\n"

# ---- 2. Call /make-payout ----
echo "Calling /make-payout endpoint..."
curl -X POST "$BASE_URL/btc/make-payout" \
  -H "Content-Type: application/json" \
  -d '{
    "addressArray": ["0xb386170A2717Dbb65C2EeE4062a5Bb097C895a0E", "0xcfa038455b54714821f291814071161c9870B891"],
    "amountArray": [0.000001, 0.000001]
  }'
echo -e "\n"
