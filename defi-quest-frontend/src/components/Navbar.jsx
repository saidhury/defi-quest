// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import GlossaryModal from "./GlossaryModal";

const HelpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const Navbar = ({ account }) => {
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  return (
    <>
      <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            DeFiQuest
          </Link>
          <div className="nav-menu">
            <NavLink to="/app/quests" className="nav-link">Quests</NavLink>
            <NavLink to="/leaderboard" className="nav-link">Leaderboard</NavLink>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
          </div>
          <div className="nav-right">
            <button className="help-button" title="Open DeFi Glossary" onClick={() => setIsGlossaryOpen(true)}>
              <HelpIcon />
            </button>
            <div className="nav-wallet">
              {account ? (
                <div className="account-display">{`${account.slice(0, 6)}...${account.slice(-4)}`}</div>
              ) : (
                <Link to="/login" className="connect-button">Launch App</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;