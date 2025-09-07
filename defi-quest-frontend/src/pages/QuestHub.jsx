import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const QuestCard = ({ quest }) => {
  return (
    <Link to={`/app/quest/${quest.id}`} className="quest-card">
      <div>
        <h3>{quest.title}</h3>
        <p>{quest.description}</p>
      </div>
      <div className="reward-info">
        <span>Reward: {quest.rewardDetails.description || quest.rewardDetails.name}</span>
      </div>
    </Link>
  );
};

const QuestHub = () => {
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuests = async () => {
            try {
                const response = await axios.get(`${API_URL}/quests`);
                setQuests(response.data);
            } catch (error) {
                console.error("Failed to fetch quests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuests();
    }, []);

    if (loading) {
        return <div>Loading quests...</div>;
    }

    return (
    <div className="quest-hub">
      <h2>Available Quests</h2>
      <div className="quest-grid">
        {quests.map(quest => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
};

export default QuestHub;