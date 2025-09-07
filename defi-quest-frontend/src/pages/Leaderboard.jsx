import React from 'react';

const Leaderboard = () => {
  return (
    <div className="placeholder-page">
      <h1>Leaderboard</h1>
      <p>Coming Soon! Climb the ranks by earning Quest Points and show off your DeFi mastery.</p>
      <div className="mock-leaderboard">
        <div className="leaderboard-entry"><span>1. 🥇</span><span>0xAb...c1</span><span>5,250 QP</span></div>
        <div className="leaderboard-entry"><span>2. 🥈</span><span>0xDe...f2</span><span>4,800 QP</span></div>
        <div className="leaderboard-entry"><span>3. 🥉</span><span>0xGg...h3</span><span>4,150 QP</span></div>
        <div className="leaderboard-entry"><span>4.</span><span>You!</span><span>0 QP</span></div>
      </div>
    </div>
  );
};

export default Leaderboard;