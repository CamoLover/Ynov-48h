import './App.css';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import QRCodePuzzle from './QRCodePuzzle';

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
  const [currentPath, setCurrentPath] = useState('~');
  const [isAwaitingPassword, setIsAwaitingPassword] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  const [userId, setUserId] = useState('');
  const [os, setOs] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPuzzleActive, setIsPuzzleActive] = useState(false);
  const [isAutodestructionActive, setIsAutodestructionActive] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
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
    const rawInput = input.trim();
    if (!rawInput && !isAwaitingPassword) return;

    if (isAwaitingPassword) {
      if (rawInput === '1.20') {
        setOutput([...output, { command: '(hidden password)', response: '[ACCÈS AUTORISÉ] Entrée dans le répertoire archives.', path: currentPath }]);
        setCurrentPath(pendingPath);
        setIsAwaitingPassword(false);
        setPendingPath(null);
        setInput('');
        return;
      } else {
        setOutput([...output, { command: '(hidden password)', response: '[ERREUR] Mot de passe incorrect. Accès refusé.', path: currentPath }]);
        setIsAwaitingPassword(false);
        setPendingPath(null);
        setInput('');
        return;
      }
    }

    // Split args properly, handling quotes
    const commandRegex = rawInput.match(/(?:[^\s"]+|"[^"]*")+/g);
    const args = commandRegex ? commandRegex.map(arg => arg.replace(/^"|"$/g, '')) : [];
    if (args.length === 0) return;

    const baseCommand = args[0].toLowerCase();
    let response = '';
    let newPath = currentPath;

    switch(baseCommand) {
      case 'help':
        response = `Commandes disponibles:
  HELP      - Affiche cette liste de commandes
  PING      - Teste la connexion
  CLEAR     - Efface le terminal
  CD        - Changer de répertoire
  LS        - Lister le contenu du répertoire
  CAT       - Afficher le contenu d'un fichier
  DOWNLOAD  - Télécharger un fichier localement
  DECRYPT   - Décrypter un message`;
        break;
      case 'ping':
        response = 'PONG';
        break;
      case 'clear':
        setOutput([]);
        setInput('');
        return;

      case 'cat':
        if (args[1] === '.note_interne.txt') {
          if (currentPath === '~' || currentPath === '/') {
            response = `[NOTE INTERNE - RÉSEAU YNOV]
Le Wi-Fi du campus est encore tombé. Le projet secret a été déplacé sur un serveur local situé derrière la machine à café du 2ème étage.
Accès via /archives.`;
          } else {
            response = 'cat: .note_interne.txt: Aucun fichier ou dossier de ce type';
          }
        } else if (args[1] === 'note_interne.txt') {
            response = 'cat: note_interne.txt: Aucun fichier ou dossier de ce type (Peut-être s\'agit-il d\'un fichier caché ?)';
        } else if (!args[1]) {
          response = 'cat: veuillez spécifier un fichier à lire.';
        } else {
          response = `cat: ${args[1]}: Aucun fichier ou dossier de ce type`;
        }
        break;
      case 'cd':
        if (args[1] === '/archives' || args[1] === 'archives') {
          setIsAwaitingPassword(true);
          setPendingPath('/archives');
          response = 'Activation du protocole de sécurité. Mot de passe requis :';
        } else if (args[1] === '/' || args[1] === '..' || args[1] === '~') {
          newPath = '~';
        } else if (!args[1]) {
          newPath = '~';
        } else {
          response = `cd: ${args[1]}: Aucun fichier ou dossier de ce type`;
        }
        break;
      case 'ls':
        const isLong = args.includes('-la') || args.includes('-l');
        const isAll = args.includes('-a') || args.includes('-la');
        if (currentPath === '~' || currentPath === '/') {
          if (isLong) {
            response = `total 2
d rwxr-xr-x  2 user  staff  64 Mar 30 11:20 archives
- rw-r--r--  1 user  staff  152 Mar 30 14:45 .note_interne.txt`;
          } else if (isAll) {
            response = 'archives/  .note_interne.txt';
          } else {
            response = 'archives/';
          }
        } else if (currentPath === '/archives') {
          if (isLong) {
            response = `total 1
- rw-r--r--  1 user  staff  5048 Mar 30 09:46 photo_de_groupe_b3.png`;
          } else {
            response = 'photo_de_groupe_b3.png';
          }
        }
        break;
      case 'download':
        if (args[1] === 'photo_de_groupe_b3.png') {
          if (currentPath === '/archives') {
            const link = document.createElement('a');
            link.href = '/photo_de_groupe_b3.png';
            link.download = 'photo_de_groupe_b3.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            response = 'Téléchargement de photo_de_groupe_b3.png démarré...';
          } else {
            response = 'download: fichier introuvable dans le répertoire courant.';
          }
        } else if (!args[1]) {
          response = 'download: veuillez spécifier un fichier à télécharger.';
        } else {
          response = `download: fichier respectif introuvable.`;
        }
        break;
      case 'decrypt':
        const lowerArgs = args.map(a => a.toLowerCase());
        if (lowerArgs.includes('--caesar') && lowerArgs.includes('--shift') && lowerArgs.includes('13') && lowerArgs.includes('senzgyr')) {
          response = `[OK] Mot de passe : "Fractal". Commande débloquée : 'hack_cafet'`;
        } else {
          response = `> ERROR: Argument(s) manquant(s) ou invalide(s).
> AIDE DE LA COMMANDE DECRYPT:
  Utilisation: decrypt [OPTIONS] "texte"
  Options disponibles:
    --caesar       Utilise le chiffrement de César
    --shift <n>    Définit le décalage (nombre entier)
  Exemple: decrypt --caesar --shift 3 "texte_a_decrypter"`;
        }
        break;
      case 'hack_cafet':
        response = '[!] ERREUR : Tentative de piratage du solde IZLY détectée. Brouillage activé.';
        setTimeout(() => setIsPuzzleActive(true), 2000);
        break;
      case 'execute':
        if (args[1] === 'autodestruction.sh') {
          response = '[SYSTEM] Initialisation de la séquence d\'autodestruction...';
          handleAutodestruction();
        } else if (!args[1]) {
          response = 'execute: argument manquant.';
        } else {
          response = `execute: ${args[1]}: Fichier non trouvé.`;
        }
        break;
      default:
        response = `Commande inconnue: ${baseCommand}. Tapez HELP pour voir les commandes disponibles.`;
    }

    setOutput([...output, { command: rawInput, response, path: currentPath }]);
    setCurrentPath(newPath);
    setInput('');
  };

  const handleAutodestruction = async () => {
    const steps = [
      "[SYSTEM] extinction des lumières du bâtiment A... OK",
      "[SYSTEM] Verrouillage des salles de TP... OK",
      "[SYSTEM] Suppression des notes du module Java... OK"
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOutput(prev => [...prev, { command: '', response: step, path: currentPath }]);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAutodestructionActive(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    setShowFinalMessage(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const words = input.split(' ');
      const lastWord = words[words.length - 1].toLowerCase();
      if (!lastWord && words.length === 1) return;

      let suggestions = [];
      
      if (words.length === 1) {
        // Complete commands
        const commands = ['help', 'ping', 'clear', 'cd', 'ls', 'cat', 'download', 'decrypt', 'hack_cafet'];
        suggestions = commands.filter(c => c.startsWith(lastWord));
      } else {
        // Complete files based on path
        let files = [];
        if (currentPath === '~' || currentPath === '/') {
          files = ['archives', '.note_interne.txt'];
        } else if (currentPath === '/archives') {
          files = ['photo_de_groupe_b3.png'];
        }
        suggestions = files.filter(f => f.toLowerCase().startsWith(lastWord));
      }

      if (suggestions.length === 1) {
        words[words.length - 1] = suggestions[0];
        setInput(words.join(' '));
      }
    }
  };

  const handlePuzzleSolved = () => {
    setIsPuzzleActive(false);
    setOutput(prev => [...prev, { 
      command: 'SYSTEM_SCAN', 
      response: `[OK] QR Code Identifié.
Message décrypté : "Félicitations, vous venez de payer un café virtuel à tout le staff technique."
Instruction : Envoyez "CAFÉ" par mail à admin@ynov.com pour valider votre exploit.`, 
      path: currentPath 
    }]);
  };

  return (
    <div className="App" onClick={(e) => {
      if (!e.target.closest('.notification-bell') && !e.target.closest('.notification-modal')) {
        inputRef.current?.focus();
      }
    }}>
      {isAutodestructionActive && (
        <div className="autodestruction-overlay">
          {showFinalMessage && (
            <div className="final-message">
              Felicitation tu as reussi a pirater le systeme.
            </div>
          )}
        </div>
      )}
      {isPuzzleActive && (
        <QRCodePuzzle 
          onSolved={handlePuzzleSolved} 
          onCancel={() => setIsPuzzleActive(false)} 
        />
      )}
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
                  <span className="prompt">user@EFYNOV:{item.path}$</span> {item.command}
                </div>
                {item.response && (
                  <div className="response">
                    <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{item.response}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommand} className="input-line">
            <span className="prompt">
              {isAwaitingPassword ? 'PASSWORD REQUIRED:' : `user@EFYNOV:${currentPath}$`}
            </span>
            <input
              ref={inputRef}
              type={isAwaitingPassword ? 'password' : 'text'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
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
