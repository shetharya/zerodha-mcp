const fs = require("fs");
const dotenv = require("dotenv");
const { KiteConnect } = require("kiteconnect");

// Load .env
dotenv.config();

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const requestToken = process.env.REQUEST_TOKEN;

const kc = new KiteConnect({ api_key: apiKey });

kc.generateSession(requestToken, apiSecret)
  .then((response: any) => {
    const accessToken = response.access_token;

    fs.writeFileSync(".env.token", `ACCESS_TOKEN=${accessToken}`);
    console.log("✅ Access token saved to .env.token");
  })
  .catch((err: any) => {
    console.error("❌ Error generating session:", err);
  });
