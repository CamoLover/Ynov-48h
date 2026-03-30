import './App.css';
import { useState, useRef, useEffect } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    </div>
  );
}

export default App;
