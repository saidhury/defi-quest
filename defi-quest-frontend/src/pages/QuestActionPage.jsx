import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ethers } from 'ethers';

import QuestPointsAbi from '../abi/QuestPoints.json';
import MockStakingAbi from '../abi/MockStaking.json';
import Toast from '../components/Toast';

const API_URL = import.meta.env.VITE_API_URL;

const QuestActionPage = () => {
  const { questId } = useParams();
  const [quest, setQuest] = useState(null);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);
  
  const showToast = (message, type = "info") => {
    setToast({ visible: true, message, type });
  };

  const getSigner = useCallback(async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const questsResponse = await axios.get(`${API_URL}/quests`);
        const selectedQuest = questsResponse.data.find(q => q.id === parseInt(questId));
        setQuest(selectedQuest);

        if (selectedQuest && selectedQuest.actionConfig.tokenToApproveAddress) {
          const signer = await getSigner();
          const tokenContract = new ethers.Contract(selectedQuest.actionConfig.tokenToApproveAddress, QuestPointsAbi, signer);
          const userBalance = await tokenContract.balanceOf(await signer.getAddress());
          setBalance(ethers.formatEther(userBalance));
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        showToast("Could not load quest data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [questId, getSigner]);

  const handleAction = async (actionType) => {
    if (!quest || !amount) {
      showToast("Please enter an amount.", "error");
      return;
    }
    
    setIsProcessing(true);
    showToast(`Processing ${actionType}... please check your wallet.`, "info");
    
    try {
      const signer = await getSigner();
      const parsedAmount = ethers.parseEther(amount);
      let tx;

      if (actionType === 'approve') {
        const tokenContract = new ethers.Contract(quest.actionConfig.tokenToApproveAddress, QuestPointsAbi, signer);
        tx = await tokenContract.approve(quest.actionConfig.targetContractAddress, parsedAmount);
      } else if (actionType === 'stake') {
        const stakingContract = new ethers.Contract(quest.actionConfig.targetContractAddress, MockStakingAbi, signer);
        tx = await stakingContract.stake(parsedAmount);
      }
      
      await tx.wait();
      showToast(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} successful!`, "success");

    } catch (error) {
      console.error(`${actionType} failed:`, error);
      showToast(error.reason || `Failed to ${actionType}.`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!quest) return <div>Quest not found.</div>;
  
  // Placeholder for a real block explorer link
  const blockExplorerLink = `https://sepolia.etherscan.io/address/${quest.actionConfig.targetContractAddress}`;

  return (
    <div className="quest-action-page">
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />}
      <Link to={`/app/quest/${questId}`} className="back-link">&larr; Back to Quest Details</Link>
      
      <div className="action-container">
        <div className="action-page-header">
          <h3>{quest.title}</h3>
          <p>Complete the on-chain action below to progress in your quest.</p>
        </div>

        <div className="info-box">
          <h4>Why are there two steps (Approve & Stake)?</h4>
          <p>This is a standard security pattern in DeFi. Your tokens are always in your wallet. The 'Approve' transaction gives the smart contract *permission* to interact with your tokens. The 'Stake' transaction then tells the contract to *use* that permission.</p>
        </div>

        <div className="balance-display">
          <span>Your QP Balance:</span>
          <strong>{parseFloat(balance).toFixed(2)} QP</strong>
        </div>

        <input
          type="number"
          className="action-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 100"
          disabled={isProcessing}
        />
        <div className="action-buttons">
          <button onClick={() => handleAction('approve')} disabled={isProcessing}>1. Approve</button>
          <button onClick={() => handleAction('stake')} disabled={isProcessing}>2. Stake</button>
        </div>
        
        <div className="contract-info">
          <p>You are interacting with a smart contract. <a href={blockExplorerLink} target="_blank" rel="noopener noreferrer">Verify on Block Explorer</a></p>
        </div>
      </div>
    </div>
  );
};

export default QuestActionPage;