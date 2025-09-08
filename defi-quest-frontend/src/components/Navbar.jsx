import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ account }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          DeFiQuest
        </Link>
        <div className="nav-menu">
          <NavLink to="/app/quests" className="nav-link">
            Quests
          </NavLink>
          <NavLink to="/leaderboard" className="nav-link">
            Leaderboard
          </NavLink>
          <NavLink to="/profile" className="nav-link">
            Profile
          </NavLink>
        </div>
        <div className="nav-wallet">
          {account ? (
            <div className="account-display">{`${account.slice(0, 6)}...${account.slice(-4)}`}</div>
          ) : (
            <Link to="/login" className="connect-button">
              Launch App
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
