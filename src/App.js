import './App.css';
import { useState, useRef, useEffect } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [currentPath, setCurrentPath] = useState('~');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e) => {
    e.preventDefault();
    const rawInput = input.trim();
    if (!rawInput) return;

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
      case 'cd':
        if (args[1] === '/archives' || args[1] === 'archives') {
          newPath = '/archives';
        } else if (args[1] === '/' || args[1] === '..' || args[1] === '~') {
          newPath = '~';
        } else if (!args[1]) {
          newPath = '~';
        } else {
          response = `cd: ${args[1]}: Aucun fichier ou dossier de ce type`;
        }
        break;
      case 'ls':
        if (currentPath === '~' || currentPath === '/') {
          response = 'd rwxr-xr-x  archives';
        } else if (currentPath === '/archives') {
          response = '- rw-r--r--  photo_de_groupe_b3.png';
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
      default:
        response = `Commande inconnue: ${baseCommand}. Tapez HELP pour voir les commandes disponibles.`;
    }

    setOutput([...output, { command: rawInput, response, path: currentPath }]);
    setCurrentPath(newPath);
    setInput('');
  };

  return (
    <div className="App" onClick={() => inputRef.current?.focus()}>
      <div className="terminal">
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
                <div className="response"><pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{item.response}</pre></div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleCommand} className="input-line">
          <span className="prompt">user@EFYNOV:{currentPath}$</span>
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
    </div>
  );
}

export default App;
