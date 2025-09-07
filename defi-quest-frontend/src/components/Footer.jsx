import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-about">
          <h3 className="footer-logo">DeFiQuest</h3>
          <p>Learn, practice, and earn rewards by completing real on-chain quests in a risk-free environment.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/app/quests">Quests</Link></li>
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/partners">Partners</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Community</h4>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer" title="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" title="Discord">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.53,3.23A2.06,2.06,0,0,0,19.19,2.5a15.42,15.42,0,0,0-4.43.43,13.72,13.72,0,0,0-5.52,0,16.21,16.21,0,0,0-4.43-.43A2.06,2.06,0,0,0,2.47,3.23,2,2,0,0,0,2.23,5.6a15.84,15.84,0,0,0,2,8.12,14.28,14.28,0,0,0,5,5.28,1,1,0,0,0,.86,0,14.28,14.28,0,0,0,5-5.28,15.84,15.84,0,0,0,2-8.12A2,2,0,0,0,21.53,3.23ZM8.45,14.46a2,2,0,1,1,2-2A2,2,0,0,1,8.45,14.46Zm7.1,0a2,2,0,1,1,2-2A2,2,0,0,1,15.55,14.46Z"></path></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" title="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,0,0,2,12c0,4.42,2.87,8.17,6.84,9.5.5.08.66-.21.66-.47,0-.23,0-.84,0-1.64-2.78.6-3.37-1.34-3.37-1.34A2.65,2.65,0,0,0,4.9,16.2c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34c-2.22-.25-4.55-1.11-4.55-4.94,0-1.1.39-2,1-2.65a2.53,2.53,0,0,1,.1-2.61s.84-.27,2.75,1a9.64,9.64,0,0,1,5,0c1.91-1.27,2.75-1,2.75-1a2.53,2.53,0,0,1,.1,2.61,2.4,2.4,0,0,1,1,2.65c0,3.84-2.34,4.68-4.57,4.93a2.21,2.21,0,0,1,.65,1.69c0,1.21,0,2.19,0,2.48,0,.26.16.55.67.47A10,10,0,0,0,22,12,10,10,0,0,0,12,2Z"></path></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 DeFiQuest. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;