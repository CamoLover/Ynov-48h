import './App.css';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// Cookie helper functions
const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

const generateUserId = () => {
  return 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const getOS = () => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.indexOf(platform) !== -1) return 'MacOS';
  if (iosPlatforms.indexOf(platform) !== -1) return 'iOS';
  if (windowsPlatforms.indexOf(platform) !== -1) return 'Windows';
  if (/Android/.test(userAgent)) return 'Android';
  if (/Linux/.test(platform)) return 'Linux';
  return 'Unknown';
};

// WebSocket connection URL
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

function Main() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [userId, setUserId] = useState('');
  const [os, setOs] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();

    // Get or create user ID
    let storedUserId = getCookie('efynov_user_id');
    if (!storedUserId) {
      storedUserId = generateUserId();
      setCookie('efynov_user_id', storedUserId, 365);
    }
    setUserId(storedUserId);

    // Detect OS
    setOs(getOS());

    // Connect to WebSocket server
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to notification server');
      addNotification('Connexion au serveur établie');
    });

    socket.on('notification', (data) => {
      console.log('Received notification:', data);
      addNotification(data.message);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from notification server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addNotification = (message) => {
    const newNotif = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleCommand = (e) => {
    e.preventDefault();
    const command = input.trim().toLowerCase();

    let response = '';

    switch(command) {
      case 'help':
        response = `Commandes disponibles:
  HELP  - Affiche cette liste de commandes
  PING  - Teste la connexion
  CLEAR - Efface le terminal`;
        break;
      case 'ping':
        response = 'PONG';
        break;
      case 'clear':
        setOutput([]);
        setInput('');
        return;
      case '':
        break;
      default:
        response = `Commande inconnue: ${input}. Tapez HELP pour voir les commandes disponibles.`;
    }

    if (input.trim()) {
      setOutput([...output, { command: input, response }]);
    }
    setInput('');
  };

  return (
    <div className="App" onClick={(e) => {
      if (!e.target.closest('.notification-bell') && !e.target.closest('.notification-modal')) {
        inputRef.current?.focus();
      }
    }}>
      <div className="terminal">
        <div className="terminal-header">
          <div className="header-left">
            <span className="user-id">ID: {userId}</span>
            <span className="separator">|</span>
            <span className="os-info">OS: {os}</span>
          </div>
          <div className="header-right">
            <button
              className={`notification-bell ${unreadCount > 0 ? 'has-unread' : ''}`}
              onClick={toggleNotifications}
            >
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
          </div>
        </div>

        {showNotifications && (
          <div className="notification-modal">
            <div className="notification-header">
              <span>NOTIFICATIONS</span>
              <button className="close-btn" onClick={() => setShowNotifications(false)}>×</button>
            </div>
            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-item">Aucune notification</div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className="notification-item">
                    <span className="notif-time">[{notif.timestamp}]</span> {notif.message}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="terminal-content">
          <pre className="ascii-art">{`
  ______  _____  _____          _____  ______   ______ _____   ____  __  __  __     ___   _  ______      __
 |  ____|/ ____|/ ____|   /\\   |  __ \\|  ____| |  ____|  __ \\ / __ \\|  \\/  | \\ \\   / / \\ | |/ __ \\ \\    / /
 | |__  | (___ | |       /  \\  | |__) | |__    | |__  | |__) | |  | | \\  / |  \\ \\_/ /|  \\| | |  | \\ \\  / /
 |  __|  \\___ \\| |      / /\\ \\ |  ___ |  __|   |  __| |  _  /| |  | | |\\/| |   \\   / | . \` | |  | |\\ \\/ /
 | |____ ____) | |____ / ____ \\| |    | |____  | |    | | \\ \\| |__| | |  | |    | |  | |\\  | |__| | \\  /
 |______|_____/ \\_____/_/    \\_\\_|    |______| |_|    |_|  \\_\\\\____/|_|  |_|    |_|  |_| \\_|\\____/   \\/
        `}</pre>

        <p className="help-text">Écrivez HELP pour afficher les commandes</p>

          <div className="output">
            {output.map((item, index) => (
              <div key={index} className="output-block">
                <div className="command-line">
                  <span className="prompt">user@EFYNOV:~$</span> {item.command}
                </div>
                {item.response && (
                  <div className="response">{item.response}</div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommand} className="input-line">
            <span className="prompt">user@EFYNOV:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="terminal-input"
              autoFocus
              spellCheck="false"
            />
          </form>
        </div>

        <div className="terminal-footer">
          <div className="footer-content">
            <span>ESCAPE FROM YNOV v1.0.0</span>
            <span className="separator">|</span>
            <span>© 2026 YNOV</span>
            <span className="separator">|</span>
            <span>Système actif</span>
            <span className="separator">|</span>
            <span className="admin-link" onClick={() => navigate('/admin')}>Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
