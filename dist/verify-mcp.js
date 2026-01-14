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
const kiteconnect_1 = require("kiteconnect");
const fs = __importStar(require("fs"));
const dotenv = __importStar(require("dotenv"));
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
const kc = new kiteconnect_1.KiteConnect({
    api_key: apiKey,
    access_token: accessToken,
});
function verify() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🔍 Verifying Zerodha Connection...");
        try {
            const profile = yield kc.getProfile();
            console.log("✅ Profile fetched:", profile.user_name);
        }
        catch (error) {
            console.error("❌ Failed to fetch profile:", error.message);
        }
        try {
            const holdings = yield kc.getHoldings();
            console.log("✅ Holdings fetched:", holdings.length, "items");
        }
        catch (error) {
            console.error("❌ Failed to fetch holdings:", error.message);
        }
    });
}
verify();
