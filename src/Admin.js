import './Admin.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

function Admin() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [connectedClients, setConnectedClients] = useState(0);
  const [sentNotifications, setSentNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Admin connected to server');
    });

    newSocket.on('client-count', (count) => {
      setConnectedClients(count);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const notification = {
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString()
      };

      socket.emit('send-notification', notification);

      setSentNotifications(prev => [{
        ...notification,
        id: Date.now()
      }, ...prev]);

      setMessage('');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>PANNEAU ADMINISTRATEUR</h1>
          <p className="warning-text">Cette page ne fait pas partie du jeu</p>
        </div>

        <div className="admin-content">
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-label">Clients connectés</div>
              <div className="stat-value">{connectedClients}</div>
            </div>
          </div>

          <div className="notification-section">
            <h2>Envoyer une notification</h2>
            <form onSubmit={handleSendNotification} className="notification-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Entrez votre message..."
                className="notification-input"
              />
              <button type="submit" className="send-btn">
                ENVOYER
              </button>
            </form>
          </div>

          <div className="history-section">
            <h2>Historique des notifications envoyées</h2>
            <div className="history-list">
              {sentNotifications.length === 0 ? (
                <div className="history-item empty">Aucune notification envoyée</div>
              ) : (
                sentNotifications.map(notif => (
                  <div key={notif.id} className="history-item">
                    <span className="history-time">[{notif.timestamp}]</span>
                    <span className="history-message">{notif.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="admin-footer">
          <button
            className="back-to-main-btn"
            onClick={() => navigate('/')}
          >
            RETOUR À LA PAGE PRINCIPALE
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
