// Import required modules (CommonJS style)
const { KiteConnect } = require("kiteconnect");
const fs = require("fs");
const dotenv = require("dotenv");

// Load environment variables from .env and .env.token
dotenv.config();
dotenv.config({ path: ".env.token" }); // Load ACCESS_TOKEN from .env.token

// Initialize KiteConnect
const kc = new KiteConnect({
  api_key: process.env.API_KEY,
});

// Set access token
kc.setAccessToken(process.env.ACCESS_TOKEN);

// Place order to BUY GOLDBEES ETF
kc.placeOrder("regular", {
  exchange: "NSE",
  tradingsymbol: "GOLDBEES",       // GOLD ETF symbol
  transaction_type: "BUY",         // ✅ Set to BUY
  quantity: 1,
  product: "CNC",                  // Delivery-based order
  order_type: "MARKET",           // Market order
})
  .then((response: any) => {
    console.log("✅ Order placed successfully:", response);
  })
  .catch((err: any) => {
    console.error("❌ Order failed:", err);
  });
