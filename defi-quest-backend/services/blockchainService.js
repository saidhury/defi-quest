const { ethers } = require("ethers");
require("dotenv").config();

// ABIs
const questContractAbi = require("../abi/Quest.json");

// --- Configuration ---
const providerUrl = process.env.BLOCKDAG_NODE_URL;
const questContractAddress = process.env.QUEST_CONTRACT_ADDRESS;

// --- In-memory Database for MVP ---
const userProgress = {}; 

// --- Ethers Setup ---
const provider = new ethers.JsonRpcProvider(providerUrl);
const questContract = new ethers.Contract(questContractAddress, questContractAbi, provider);

// --- Service Logic ---

/**
 * Initializes the service, connects to the blockchain, and starts listening to events.
 */
const initialize = async () => {
    try {
        console.log("Connecting to BlockDAG node...");
        const network = await provider.getNetwork();
        console.log(`Successfully connected to network: ${network.name} (Chain ID: ${network.chainId})`);
        console.log("Event listener disabled for hackathon MVP. User progress will be fetched on demand.");


    } catch (error) {
        console.error("Failed to initialize blockchain service:", error);
    }
};



/**
 * Subscribes to the QuestCompleted event from the Quest smart contract.
 */
const listenForQuestCompletion = () => {
    questContract.on("QuestCompleted", (user, questId, event) => {
        console.log(`QuestCompleted Event Detected: User ${user} completed Quest ID ${questId}`);

        const questIdNum = Number(questId);
        
        if (!userProgress[user]) {
            userProgress[user] = { questPoints: 0, completedQuests: [] };
        }
        
        if (!userProgress[user].completedQuests.includes(questIdNum)) {
            userProgress[user].questPoints += 100;
            userProgress[user].completedQuests.push(questIdNum);
        }

        console.log("Updated User Progress:", userProgress[user]);
    });
};

/* Retrieves progress for a specific user.
 * @param {string} userAddress The user's wallet address.
 * @returns {object} The user's progress data.
 */
const getUserProgress = async (userAddress) => {
    try {
        return userProgress[userAddress] || { questPoints: 0, completedQuests: [] };
    } catch (error) {
        console.error("Error fetching user progress from chain:", error);
        return { questPoints: 0, completedQuests: [] };
    }
};


module.exports = {
    initialize,
    getUserProgress,
    questContract
};