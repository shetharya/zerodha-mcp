const { KiteConnect } = require("kiteconnect");

// Replace with your actual API key
const apiKey = "u9zctxbzbz3wgno1";

const kc = new KiteConnect({ api_key: apiKey });

console.log("🔗 Login URL:", kc.getLoginURL());

