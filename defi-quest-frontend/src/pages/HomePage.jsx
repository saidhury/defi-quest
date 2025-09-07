import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ account }) => {
  const ctaLink = account ? "/app/quests" : "/login";

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Master DeFi.</span> Earn Rewards.
          </h1>
          <p className="hero-subtitle">Your adventure into Decentralized Finance begins here. Learn, practice, and earn rewards by completing real on-chain quests.</p>
          <Link to={ctaLink} className="hero-cta-button">
            Launch App & Start Questing
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>A Simple Path to DeFi Mastery</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Connect & Explore</h3>
            <p>Connect your Web3 wallet and browse our library of quests designed to teach you core DeFi concepts.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Learn & Practice</h3>
            <p>Follow our step-by-step guides to perform real on-chain actions like swapping, staking, or providing liquidity on a safe testnet.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Verify & Earn</h3>
            <p>Once you've completed the action, our smart contracts verify it on-chain and you can claim your rewards—Quest Points and NFT badges!</p>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;