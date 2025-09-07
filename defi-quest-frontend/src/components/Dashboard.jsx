import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Dashboard = ({ userAddress }) => {
  const [progress, setProgress] = useState({ questPoints: 0, completedQuests: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!userAddress) return;

      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/user/${userAddress}/progress`);
        setProgress(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user progress:", err);
        setError("Could not load your progress. Please try again later.");
        // Set default state in case of error
        setProgress({ questPoints: 0, completedQuests: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [userAddress]);

  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h2>Your Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card points-card">
          <h3>Quest Points (QP)</h3>
          <p className="points-balance">{progress.questPoints}</p>
        </div>
        <div className="dashboard-card badges-card">
          <h3>Earned Badges</h3>
          <div className="badges-gallery">
            {progress.completedQuests.includes(2) ? (
              <div className="badge">
                <img src="https://via.placeholder.com/100" alt="Liquidity Master Badge" />
                {/* <p>Liquidity Master</p> */}
              </div>
            ) : (
              <p>No badges earned yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
