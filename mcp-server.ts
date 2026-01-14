import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { KiteConnect } from "kiteconnect";
import * as fs from "fs";
import * as dotenv from "dotenv";

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

const kc = new KiteConnect({
  api_key: apiKey,
  access_token: accessToken,
});

// Create an MCP server
const server = new McpServer({
  name: "Zerodha Trading Bot",
  version: "1.0.0",
});

// Tool: Get User Profile
server.tool(
  "get_profile",
  {},
  async () => {
    try {
      const profile = await kc.getProfile();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(profile, null, 2),
          },
        ],
      };
    } catch (error: any) {
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
  }
);

// Tool: Get Holdings
server.tool(
  "get_holdings",
  {},
  async () => {
    try {
      const holdings = await kc.getHoldings();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(holdings, null, 2),
          },
        ],
      };
    } catch (error: any) {
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
  }
);

// Tool: Get Positions
server.tool(
  "get_positions",
  {},
  async () => {
    try {
      const positions = await kc.getPositions();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(positions, null, 2),
          },
        ],
      };
    } catch (error: any) {
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
  }
);

// Tool: Get Quote
server.tool(
  "get_quote",
  {
    instruments: z.array(z.string()).describe("List of instrument tokens or symbols (e.g., 'NSE:INFY', 'BSE:SENSEX')"),
  },
  async ({ instruments }) => {
    try {
      const quotes = await kc.getQuote(instruments);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(quotes, null, 2),
          },
        ],
      };
    } catch (error: any) {
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
  }
);

// Tool: Place Order
server.tool(
  "place_order",
  {
    exchange: z.enum(["NSE", "BSE", "NFO", "CDS", "BFO", "MCX"]).describe("Exchange (NSE, BSE, etc.)"),
    tradingsymbol: z.string().describe("Trading symbol (e.g., INFY, RELIANCE)"),
    transaction_type: z.enum(["BUY", "SELL"]).describe("Transaction type (BUY or SELL)"),
    quantity: z.number().int().positive().describe("Quantity to buy or sell"),
    product: z.enum(["CNC", "NRML", "MIS"]).describe("Product type (CNC for delivery, MIS for intraday, NRML for F&O)"),
    order_type: z.enum(["MARKET", "LIMIT", "SL", "SL-M"]).describe("Order type (MARKET, LIMIT, etc.)"),
    price: z.number().optional().describe("Price (required for LIMIT orders)"),
    trigger_price: z.number().optional().describe("Trigger price (required for SL, SL-M orders)"),
    tag: z.string().optional().describe("Optional tag for the order"),
  },
  async (args) => {
    try {
      const response = await kc.placeOrder("regular", {
        exchange: args.exchange,
        tradingsymbol: args.tradingsymbol,
        transaction_type: args.transaction_type,
        quantity: args.quantity,
        product: args.product,
        order_type: args.order_type,
        price: args.price,
        trigger_price: args.trigger_price,
        tag: args.tag,
      } as any);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error: any) {
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
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Zerodha MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
