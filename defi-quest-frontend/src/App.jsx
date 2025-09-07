import { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

// Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import QuestHub from './pages/QuestHub';
import QuestDetail from './pages/QuestDetail';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import About from './pages/About';    
import Partners from './pages/Partners'; 

import './App.css';

const AppLayout = ({ account }) => (
  <>
    <Dashboard userAddress={account} />
    <hr />
    <Outlet />
  </>
);

function App() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          return true; 
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask.");
    }
    return false;
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        navigate('/login'); 
      } else {
        setAccount(accounts[0]);
      }
    };
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [navigate]);


   return (
    <div className="App">
      <Navbar account={account} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage account={account} />} />
          <Route path="/login" element={<LoginPage handleConnect={handleConnect} />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />       {/* <-- Add new route */}
          <Route path="/partners" element={<Partners />} />   {/* <-- Add new route */}

          <Route element={<ProtectedRoute account={account} />}>
            <Route path="/app" element={<AppLayout account={account} />}>
              <Route path="quests" element={<QuestHub />} />
              <Route path="quest/:questId" element={<QuestDetail />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;