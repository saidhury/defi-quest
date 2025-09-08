// defi-quest-backend/services/blockchainService.js

const { ethers } = require("ethers");
const offChainQuestData = require("../data/quests.json");
const questContractAbi = require("../abi/Quest.json");
// We need the ABI for an ERC20 token to call balanceOf
const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
];

// --- Load NEW environment variables ---
const providerUrl = process.env.BLOCKDAG_NODE_URL;
const questContractAddress = process.env.QUEST_CONTRACT_ADDRESS;
const questPointsContractAddress = process.env.QUEST_POINTS_CONTRACT_ADDRESS; // <-- New

// --- Ethers Setup ---
const provider = new ethers.JsonRpcProvider(providerUrl);
const questContract = new ethers.Contract(questContractAddress, questContractAbi, provider);
// --- Create a contract instance for the QuestPoints token ---
const questPointsContract = new ethers.Contract(questPointsContractAddress, erc20Abi, provider); // <-- New

// --- Our in-memory cache for completed quests ---
const userProgress = {};

const initialize = async () => {
  try {
    console.log("Connecting to BlockDAG node...");
    const network = await provider.getNetwork();
    console.log(`Successfully connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    console.log("Backend service ready. Progress will be fetched on demand.");
  } catch (error) {
    console.error("Failed to initialize blockchain service:", error);
  }
};

// --- THIS FUNCTION IS NOW UPGRADED ---
const getUserProgress = async (userAddress) => {
  console.log(`Fetching progress for ${userAddress}...`);
  try {
    // 1. Get live token balance directly from the blockchain
    const rawBalance = await questPointsContract.balanceOf(userAddress);
    // ethers.formatEther automatically handles the 18 decimals
    const questPoints = parseFloat(ethers.formatEther(rawBalance));

    // 2. Get the list of completed quests from our fast cache
    const completedQuests = userProgress[userAddress]?.completedQuests || [];
    
    console.log(`Live balance: ${questPoints} QP, Cached quests: ${completedQuests}`);
    
    return {
      questPoints,
      completedQuests
    };

  } catch (error) {
    console.error("Error fetching live user progress:", error);
    // On error, return a default state
    return { questPoints: 0, completedQuests: [] };
  }
};

// This function remains the same. It only WRITES to our cache.
const updateUserProgress = (userAddress, questId) => {
  const questIdNum = parseInt(questId);
  console.log(`Updating cached progress for user ${userAddress} and quest ${questIdNum}`);
  
  const quest = offChainQuestData.find(q => q.id === questIdNum);
  if (!quest) {
    console.error(`Could not find quest with ID ${questIdNum}`);
    return;
  }
  
  if (!userProgress[userAddress]) {
    userProgress[userAddress] = { questPoints: 0, completedQuests: [] };
  }

  if (!userProgress[userAddress].completedQuests.includes(questIdNum)) {
    userProgress[userAddress].completedQuests.push(questIdNum);
    // We no longer need to update questPoints here, but it doesn't hurt to keep it
    // as it helps keep the cache somewhat in sync for logging.
    if (quest.rewardDetails.type === "QP") {
        // This value is now just for our internal cache, not what the user sees.
        userProgress[userAddress].questPoints += quest.rewardDetails.amount;
    }
  }

  console.log("Updated Progress Cache:", userProgress);
  return userProgress[userAddress];
};

module.exports = {
  initialize,
  getUserProgress,
  updateUserProgress,
  questContract
};