import { KiteConnect } from "kiteconnect";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

if (fs.existsSync(".env.token")) {
    dotenv.config({ path: ".env.token" });
}

const apiKey = process.env.API_KEY;
const accessToken = process.env.ACCESS_TOKEN;

if (!apiKey || !accessToken) {
    console.error("Error: API_KEY or ACCESS_TOKEN not found.");
    process.exit(1);
}

const kc = new KiteConnect({
    api_key: apiKey,
    access_token: accessToken,
});

async function verify() {
    console.log("🔍 Verifying Zerodha Connection...");

    try {
        const profile = await kc.getProfile();
        console.log("✅ Profile fetched:", profile.user_name);
    } catch (error: any) {
        console.error("❌ Failed to fetch profile:", error.message);
    }

    try {
        const holdings = await kc.getHoldings();
        console.log("✅ Holdings fetched:", holdings.length, "items");
    } catch (error: any) {
        console.error("❌ Failed to fetch holdings:", error.message);
    }
}

verify();
