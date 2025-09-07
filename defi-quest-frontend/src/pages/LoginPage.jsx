import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ handleConnect }) => {
  const navigate = useNavigate();

  const onConnect = async () => {
    const success = await handleConnect();
    if (success) {
      // Redirect to the main app after a successful connection
      navigate('/app/quests');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">DeFiQuest Awaits</h1>
        <p className="login-subtitle">Connect your Web3 wallet to begin your adventure and start earning rewards.</p>
        <button className="login-button" onClick={onConnect}>
          Connect Wallet
        </button>
        <p className="login-footer">By connecting, you agree to our Terms of Service.</p>
      </div>
    </div>
  );
};

export default LoginPage;