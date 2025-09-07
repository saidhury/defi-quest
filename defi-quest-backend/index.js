// index.js
const express = require("express");
const cors = require("cors");
const blockchainService = require("./services/blockchainService");
const offChainQuestData = require("./data/quests.json");

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// --- Middleware ---
const whitelist = [FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json());

// --- API Endpoints ---

/**
 * @api {get} /quests
 * @description Returns a merged list of on-chain and off-chain quest data.
 */
app.get("/quests", async (req, res) => {
    try {
        res.json(offChainQuestData);
    } catch (error) {
        console.error("Failed to get quests:", error);
        res.status(500).json({ error: "Failed to retrieve quest data." });
    }
});

/**
 * @api {get} /user/:address/progress
 * @description Returns a user's progress (points, completed quests).
 */
app.get("/user/:address/progress", async (req, res) => {
    const { address } = req.params;
    if (!address) {
        return res.status(400).json({ error: "User address is required." });
    }
    
    const progress = await blockchainService.getUserProgress(address);
    res.json(progress);
});

// --- Server Initialization ---

app.listen(PORT, () => {
    console.log(`DeFiQuest backend server running on port ${PORT}`);
    blockchainService.initialize();
});