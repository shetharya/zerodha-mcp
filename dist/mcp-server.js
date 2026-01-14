"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const kiteconnect_1 = require("kiteconnect");
const fs = __importStar(require("fs"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Load ACCESS_TOKEN from .env.token if available
if (fs.existsSync(".env.token")) {
    dotenv.config({ path: ".env.token" });
}
const apiKey = process.env.API_KEY;
const accessToken = process.env.ACCESS_TOKEN;
if (!apiKey || !accessToken) {
    console.error("Error: API_KEY or ACCESS_TOKEN not found in environment variables.");
    console.error("Please run the login flow first to generate .env.token");
    process.exit(1);
}
const kc = new kiteconnect_1.KiteConnect({
    api_key: apiKey,
    access_token: accessToken,
});
// Create an MCP server
const server = new mcp_js_1.McpServer({
    name: "Zerodha Trading Bot",
    version: "1.0.0",
});
// Tool: Get User Profile
server.tool("get_profile", {}, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield kc.getProfile();
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(profile, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching profile: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
}));
// Tool: Get Holdings
server.tool("get_holdings", {}, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const holdings = yield kc.getHoldings();
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(holdings, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching holdings: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
}));
// Tool: Get Positions
server.tool("get_positions", {}, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const positions = yield kc.getPositions();
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(positions, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching positions: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
}));
// Tool: Get Quote
server.tool("get_quote", {
    instruments: zod_1.z.array(zod_1.z.string()).describe("List of instrument tokens or symbols (e.g., 'NSE:INFY', 'BSE:SENSEX')"),
}, (_a) => __awaiter(void 0, [_a], void 0, function* ({ instruments }) {
    try {
        const quotes = yield kc.getQuote(instruments);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(quotes, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching quotes: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
}));
// Tool: Place Order
server.tool("place_order", {
    exchange: zod_1.z.enum(["NSE", "BSE", "NFO", "CDS", "BFO", "MCX"]).describe("Exchange (NSE, BSE, etc.)"),
    tradingsymbol: zod_1.z.string().describe("Trading symbol (e.g., INFY, RELIANCE)"),
    transaction_type: zod_1.z.enum(["BUY", "SELL"]).describe("Transaction type (BUY or SELL)"),
    quantity: zod_1.z.number().int().positive().describe("Quantity to buy or sell"),
    product: zod_1.z.enum(["CNC", "NRML", "MIS"]).describe("Product type (CNC for delivery, MIS for intraday, NRML for F&O)"),
    order_type: zod_1.z.enum(["MARKET", "LIMIT", "SL", "SL-M"]).describe("Order type (MARKET, LIMIT, etc.)"),
    price: zod_1.z.number().optional().describe("Price (required for LIMIT orders)"),
    trigger_price: zod_1.z.number().optional().describe("Trigger price (required for SL, SL-M orders)"),
    tag: zod_1.z.string().optional().describe("Optional tag for the order"),
}, (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield kc.placeOrder("regular", {
            exchange: args.exchange,
            tradingsymbol: args.tradingsymbol,
            transaction_type: args.transaction_type,
            quantity: args.quantity,
            product: args.product,
            order_type: args.order_type,
            price: args.price,
            trigger_price: args.trigger_price,
            tag: args.tag,
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(response, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error placing order: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
}));
// Start the server
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const transport = new stdio_js_1.StdioServerTransport();
        yield server.connect(transport);
        console.error("Zerodha MCP Server running on stdio");
    });
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
