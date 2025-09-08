import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import QuestContractAbi from "../abi/Quest.json";
const QUEST_CONTRACT_ADDRESS = import.meta.env.VITE_QUEST_CONTRACT_ADDRESS;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const QuestDetail = () => {
  const { questId } = useParams();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); 

  useEffect(() => {
    const fetchQuestDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/quests`);
        const selectedQuest = response.data.find(
          (q) => q.id === parseInt(questId)
        );
        setQuest(selectedQuest);
      } catch (error) {
        console.error("Failed to fetch quest details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestDetails();
  }, [questId]);


  const getQuestContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(
      QUEST_CONTRACT_ADDRESS,
      QuestContractAbi,
      signer
    );
  };

  const handleStartQuest = async () => {
    if (!quest) return;
    setStatus("Starting quest... please confirm in your wallet.");
    try {
      const contract = await getQuestContract();
      const tx = await contract.startQuest(quest.id);
      await tx.wait();
      setStatus("Quest started! You can now complete the on-chain action.");
    } catch (error) {
      console.error("Failed to start quest:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleVerifyCompletion = async () => {
    if (!quest) return;
    setStatus("Verifying completion... please confirm in your wallet.");
    try {
      const contract = await getQuestContract();
      const tx = await contract.verifyCompletion(quest.id);
      await tx.wait();
      setStatus("Verification successful! You can now claim your reward.");
    } catch (error) {
      console.error("Failed to verify completion:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    }
  };

  const handleClaimReward = async () => {
    if (!quest) return;
    setStatus("Claiming reward... please confirm in your wallet.");
    try {
      const contract = await getQuestContract();
      const tx = await contract.claimReward(quest.id);
      await tx.wait();
      setStatus("Reward claimed! Check your dashboard.");

      const userAddress = await getSignerAddress();
      await axios.post(`${API_URL}/user/update-progress`, {
        userAddress: userAddress,
        questId: quest.id,
      });
    } catch (error) {
      console.error("Failed to claim reward:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  if (loading) return <div>Loading quest details...</div>;
  if (!quest) return <div>Quest not found.</div>;

  return (
    <div className="quest-detail">
      <Link to="/app/quests" className="back-link">
        &larr; Back to All Quests
      </Link>
      <h1>{quest.title}</h1>
      <p className="difficulty">Difficulty: {quest.difficulty}</p>

      <h3>Learning Objective</h3>
      <p>{quest.learningObjective}</p>

      <h3>Step-by-Step Guide</h3>
      <ol>
        {quest.tutorialSteps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      {/* --- NEW INTERACTION FLOW --- */}
      <div className="interaction-flow">
        <div className="interaction-buttons">
          <button onClick={handleStartQuest}>1. Start Quest</button>
        </div>

        <Link
          to={`/app/quest/${quest.id}/action`}
          className="action-link-button"
        >
          Perform Action &rarr;
        </Link>

        <div className="interaction-buttons">
          <button onClick={handleVerifyCompletion}>2. Verify Completion</button>
          <button onClick={handleClaimReward}>3. Claim Reward</button>
        </div>
      </div>

      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default QuestDetail;
