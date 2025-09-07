import { ethers } from 'ethers';

const ConnectWallet = ({ setAccount }) => {
  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        alert("Failed to connect wallet. Please make sure MetaMask is installed and unlocked.");
      }
    } else {
      alert("Please install MetaMask to use this application.");
    }
  };

  return (
    <div className="connect-wallet-container">
      <h2>Welcome to your DeFi Adventure</h2>
      <button onClick={handleConnect}>Connect Your Wallet</button>
    </div>
  );
};

export default ConnectWallet;