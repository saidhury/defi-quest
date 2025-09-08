import React from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <p>{message}</p>
      <button onClick={onClose} className="toast-close-btn">&times;</button>
    </div>
  );
};

export default Toast;