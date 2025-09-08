// src/pages/QuestDetail.jsx - ENHANCED
import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";

import Toast from "../components/Toast";
import QuestContractAbi from "../abi/Quest.json";

const QUEST_CONTRACT_ADDRESS = import.meta.env.VITE_QUEST_CONTRACT_ADDRESS;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const QuestDetail = () => {
  const { questId } = useParams();

  const [quest, setQuest] = useState(null);
  const [userQuestStatus, setUserQuestStatus] = useState({
    startTime: 0,
    completed: false,
    rewardClaimed: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const showToast = (message, type = "info") => {
    setToast({ visible: true, message, type });
  };

  const getSignerAndContract = useCallback(async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(QUEST_CONTRACT_ADDRESS, QuestContractAbi, signer);
    return { signer, contract };
  }, []);

  const fetchQuestAndUserProgress = useCallback(async () => {
    if (!questId) return;
    try {
      setLoading(true);
      const { signer, contract } = await getSignerAndContract();
      const userAddress = await signer.getAddress();
      
      const questsResponse = await axios.get(`${API_URL}/quests`);
      const selectedQuest = questsResponse.data.find(q => q.id === parseInt(questId));
      setQuest(selectedQuest);

      const progress = await contract.userProgress(userAddress, questId);
      setUserQuestStatus({
        startTime: Number(progress.startTime),
        completed: progress.completed,
        rewardClaimed: progress.rewardClaimed,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast("Could not load quest data. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  }, [questId, getSignerAndContract]);

  useEffect(() => {
    fetchQuestAndUserProgress();
  }, [fetchQuestAndUserProgress]);

  const handleQuestAction = async (action) => {
    if (!quest) return;
    setIsProcessing(true);
    showToast("Processing transaction... please check your wallet.", "info");
    try {
      const { contract, signer } = await getSignerAndContract();
      let tx;
      switch(action) {
        case 'start': tx = await contract.startQuest(quest.id); break;
        case 'verify': tx = await contract.verifyCompletion(quest.id); break;
        case 'claim': tx = await contract.claimReward(quest.id); break;
        default: throw new Error("Invalid action");
      }
      await tx.wait();
      showToast("Transaction successful!", "success");

      await fetchQuestAndUserProgress();
      
      if (action === 'claim') {
        const userAddress = await signer.getAddress();
        await axios.post(`${API_URL}/user/update-progress`, {
          userAddress: userAddress,
          questId: quest.id,
        });
      }
    } catch (error) {
      console.error(`Failed to ${action} quest:`, error);
      showToast(error.reason || `Failed to ${action} quest.`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div>Loading quest details...</div>;
  if (!quest) return <div>Quest not found.</div>;

  const isStarted = userQuestStatus.startTime > 0;
  const isCompleted = userQuestStatus.completed;
  const isClaimed = userQuestStatus.rewardClaimed;

  return (
    <div className="quest-detail">
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />}
      <Link to="/app/quests" className="back-link">&larr; Back to All Quests</Link>
      <h1>{quest.title}</h1>
      <p className="difficulty">Difficulty: {quest.difficulty}</p>

      <h3>Learning Objective</h3>
      <p>{quest.learningObjective}</p>
      
      {quest.keyConcepts && (
        <>
          <h3>Key Concepts for this Quest</h3>
          <div className="concepts-grid">
            {quest.keyConcepts.map((concept) => (
              <div className="concept-card" key={concept.term}>
                <h4>{concept.term}</h4>
                <p>{concept.definition}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <h3>Step-by-Step Guide</h3>
      <ol>
        {quest.tutorialSteps.map((step, index) => (<li key={index}>{step}</li>))}
      </ol>
      <hr />

      <h3>Quest Progression</h3>
      {isClaimed ? (
        <div className="status-message success"><strong>Quest Complete!</strong> You have claimed the reward.</div>
      ) : (
        <div className="interaction-flow">
          <button onClick={() => handleQuestAction('start')} disabled={isProcessing || isStarted}>
            {isStarted ? "✓ Quest Started" : "1. Start Quest"}
          </button>
          <Link to={`/app/quest/${quest.id}/action`} className={`action-link-button ${!isStarted || isCompleted ? 'disabled' : ''}`}>
            2. Perform On-Chain Action &rarr;
          </Link>
          <button onClick={() => handleQuestAction('verify')} disabled={isProcessing || !isStarted || isCompleted}>
            {isCompleted ? "✓ Verified" : "3. Verify Completion"}
          </button>
          <button onClick={() => handleQuestAction('claim')} disabled={isProcessing || !isCompleted || isClaimed}>
            4. Claim Reward
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestDetail;