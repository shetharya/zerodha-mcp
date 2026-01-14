# Zerodha MCP Trading Bot �📈

A **TypeScript-based Model Context Protocol (MCP) server** that connects **Claude Desktop** to the **Zerodha Kite REST API**, enabling you to manage your portfolio and place live trades using plain English commands.

> ⚠️ **Warning:** This bot places **real trades with real money**. Test carefully before using in production.

---

## ✨ Features

| Tool | Description |
|---|---|
| `get_profile` | Fetch your Zerodha account profile |
| `get_holdings` | View long-term stock holdings |
| `get_positions` | View intraday/F&O positions |
| `get_quote` | Get real-time price for any stock |
| `place_order` | Buy or sell stocks across 6 exchanges |

- 🏦 Supports **6 exchanges**: NSE, BSE, NFO, CDS, BFO, MCX
- 📋 Supports **4 order types**: MARKET, LIMIT, SL, SL-M
- 📦 Supports **3 product types**: CNC (delivery), MIS (intraday), NRML (F&O)
- 🔐 Secure credential loading via `.env` and `.env.token`

---

## �️ Tech Stack

- **Runtime**: Node.js + TypeScript
- **AI Interface**: Claude Desktop via MCP (`@modelcontextprotocol/sdk`)
- **Trading API**: Zerodha Kite Connect (`kiteconnect`)
- **Validation**: Zod
- **Config**: dotenv

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/zerodha-trading-bot.git
cd zerodha-trading-bot
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your Zerodha API credentials:

```bash
copy .env.example .env
```

Edit `.env`:
```env
API_KEY=your_zerodha_api_key
API_SECRET=your_zerodha_api_secret
```

> Get your API key from [Zerodha Kite Developer Console](https://developers.kite.trade/)

---

### 3. Daily Authentication (⚡ Do this every morning)

Zerodha access tokens expire daily. Follow these steps each trading day:

**Step 1 — Get Login URL:**
```bash
npx ts-node getLoginURL.ts
```
Open the URL in your browser and log in to Zerodha.

**Step 2 — Copy Request Token:**
After login, you'll be redirected to a URL like:
```
http://localhost:3000/?status=success&request_token=YOUR_TOKEN&action=login
```
Copy the `request_token` value.

**Step 3 — Paste into `.env`:**
```env
REQUEST_TOKEN=your_copied_token_here
```

**Step 4 — Generate Session:**
```bash
npx ts-node generateSession.ts
```
This saves your `ACCESS_TOKEN` to `.env.token` automatically.

---

### 4. Connect to Claude Desktop

1. Open your Claude Desktop config file:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the contents of `claude_desktop_config.json` from this project.

3. **Restart Claude Desktop.**

---

## 💬 Example Commands

Once connected, just chat with Claude:

```
"Show me my current holdings"
"What is the live price of RELIANCE?"
"Buy 1 share of INFY at market price"        ⚠️ Real money!
"Sell 5 shares of TCS with a limit at 3800"  ⚠️ Real money!
"Show my open positions"
```

---

## 📁 Project Structure

```
zerodha-trading-bot/
├── mcp-server.ts          # Main MCP server with all 5 trading tools
├── index.ts               # Standalone order placement script
├── getLoginURL.ts         # Generates Zerodha OAuth login URL
├── generateSession.ts     # Exchanges request token for access token
├── verify-mcp.ts          # MCP server verification script
├── claude_desktop_config.json  # Claude Desktop config template
├── .env.example           # Template for environment variables
├── .env                   # Your secrets (git-ignored ✅)
├── .env.token             # Your access token (git-ignored ✅)
└── package.json
```

---

## 🔒 Security

- `.env` and `.env.token` are **git-ignored** and will never be uploaded
- Never share your `API_KEY`, `API_SECRET`, or `ACCESS_TOKEN`
- Zerodha access tokens auto-expire every 24 hours

---

## 📄 License

MIT
