// src/pages/QuestActionPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ethers } from 'ethers';

// Import ABIs for ALL interactable contracts
import QuestPointsAbi from '../abi/QuestPoints.json';
import MockStakingAbi from '../abi/MockStaking.json';
// Add ABIs for MockVault, CTK, and dUSD tokens as well

const API_URL = import.meta.env.VITE_API_URL;

const QuestActionPage = () => {
  const { questId } = useParams();
  const [quest, setQuest] = useState(null);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Ready for on-chain action...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/quests`);
    console.log("Data received from backend:", response.data);
    console.log("Type of data received:", typeof response.data);
    const questsArray = Array.isArray(response.data) ? response.data : JSON.parse(response.data);
    const selectedQuest = questsArray.find(q => q.id === parseInt(questId));
    
    if (selectedQuest) {
      setQuest(selectedQuest);
    } else {
      console.error(`Could not find quest with ID ${questId} in the received data.`);
    }

  } catch (error) {
    console.error("Failed to fetch quest details:", error);
  } finally {
    setLoading(false);
  }
};
    fetchQuestDetails();
  }, [questId]);

  const getSigner = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  };

  const handleApprove = async () => {
    if (!quest || !quest.actionConfig.tokenToApproveAddress) return;
    setStatus('Approving token spend... Please confirm in your wallet.');
    try {
      const signer = await getSigner();
      const tokenContract = new ethers.Contract(quest.actionConfig.tokenToApproveAddress, QuestPointsAbi, signer); // Assuming QuestPoints ABI for any ERC20
      const tx = await tokenContract.approve(quest.actionConfig.targetContractAddress, ethers.parseEther(amount || '0'));
      await tx.wait();
      setStatus('Approval successful! You can now proceed with the main action.');
    } catch (error) {
      console.error("Approval failed:", error);
      setStatus(`Approval failed: ${error.reason || error.message}`);
    }
  };

  const handleStake = async () => {
    if (!quest) return;
    setStatus('Staking tokens... Please confirm in your wallet.');
    try {
      const signer = await getSigner();
      const stakingContract = new ethers.Contract(quest.actionConfig.targetContractAddress, MockStakingAbi, signer);
      const tx = await stakingContract.stake(ethers.parseEther(amount || '0'));
      await tx.wait();
      setStatus('Stake successful! Return to the quest page to verify.');
    } catch (error) {
      console.error("Staking failed:", error);
      setStatus(`Staking failed: ${error.reason || error.message}`);
    }
  };

  const renderQuestActions = () => {
    if (!quest) return null;

    switch (quest.id) {
      case 1: // "Your First Stake"
        return (
          <>
            <h3>Stake Your Quest Points (QP)</h3>
            <p>Approve the contract to spend your QP, then stake them to complete the quest.</p>
            <input
              type="number"
              className="action-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 100"
            />
            <div className="action-buttons">
              <button onClick={handleApprove}>1. Approve</button>
              <button onClick={handleStake}>2. Stake</button>
            </div>
          </>
        );
      case 2: // "Mint a Stablecoin"
        return (
          <>
            <h3>Mint a Stablecoin (dUSD)</h3>
            <p>This UI is a placeholder. You would build out the approve and mint logic here.</p>
          </>
        );
      default:
        return <p>No action defined for this quest.</p>;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="quest-action-page">
      <Link to={`/app/quest/${questId}`} className="back-link">&larr; Back to Quest Details</Link>
      <div className="action-container">
        {renderQuestActions()}
        {status && <p className="status-message">{status}</p>}
      </div>
    </div>
  );
};

export default QuestActionPage;