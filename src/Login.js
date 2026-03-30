import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);

  const secretCredentials = {
    identifiant: 'joueur',
    password: 'joueur',
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (identifiant === secretCredentials.identifiant && password === secretCredentials.password) {
      setLoginStatus('success');
      navigate('/');
      return;
    }

    setLoginStatus('error');
  };

  return (
    <div className="page-shell">
    <div className="" style={{ display: 'none' }} id="joueur" password="joueur"/>
      <div className="login-card">
        <div className="left-panel">
          <div className="top-row">
            <span className="logo">SCiPnet</span>
            <svg  className="EICAR" xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 151 52" fill="none">
            <path d="M130.039 25.8874C129.503 25.3513 128.798 25.0178 128.044 24.9439C127.29 24.8699 126.534 25.06 125.904 25.4817C125.275 25.9035 124.81 26.5308 124.591 27.2569C124.371 27.983 124.409 28.7629 124.699 29.4639C124.989 30.1648 125.513 30.7433 126.181 31.101C126.849 31.4586 127.62 31.5733 128.363 31.4253C129.106 31.2774 129.775 30.8761 130.256 30.2897C130.736 29.7034 130.999 28.9682 131 28.2095C131.006 27.7773 130.925 27.3482 130.759 26.9488C130.594 26.5494 130.349 26.1882 130.039 25.8874Z" fill="#D2112E"></path>
            <path d="M22.0325 31.218V25.8248H7.4453V18.301H19.8648V12.9078H7.4453V5.64517H22.0325V0.245145H1.31006V31.218H22.0325ZM34.1866 31.218V0.245145H28.042V31.218H34.1866ZM63.6241 21.694H57.3911C56.7741 24.2142 55.1372 26.086 52.0871 26.086C50.4083 26.086 49.0369 25.4766 48.1544 24.4823C47.0042 23.1764 46.6061 21.6551 46.6061 15.7396C46.6061 9.82406 47.0042 8.3028 48.1544 6.9969C49.0369 5.99799 50.4083 5.39316 52.0871 5.39316C55.1372 5.39316 56.7298 7.26266 57.3468 9.78512H63.6334C62.4832 3.306 57.9755 0 52.0964 0C48.4734 0 45.8214 1.17532 43.6537 3.26247C40.5151 6.35082 40.4732 9.82864 40.4732 15.7442C40.4732 21.6597 40.5151 25.1375 43.6537 28.2281C45.8214 30.3153 48.4734 31.4883 52.0964 31.4883C57.9313 31.4883 62.4832 28.1846 63.6334 21.7032L63.6241 21.694ZM92.7962 31.218L81.3057 0.245145H76.486L65.0398 31.218H71.4474L73.359 25.7378H84.5352L86.3979 31.218H92.7962ZM82.9053 20.6493H75.082L79.0589 9.38647L82.9053 20.6493ZM120.52 31.218L113.491 17.8657C116.541 16.7797 119.237 14.0831 119.237 9.73242C119.237 4.55692 115.437 0.252018 109.027 0.252018H96.6869V31.218H102.829V18.8669H107.253L113.395 31.218H120.52ZM113.095 9.73242C113.095 12.1243 111.325 13.822 108.629 13.822H102.829V5.64517H108.62C111.316 5.64517 113.086 7.34056 113.086 9.73242H113.095Z" fill="currentColor"></path>
            </svg>
          </div>    
          <div className="center-text">Bienvenue dans la communauté</div>
        </div>

        <div className="right-panel">
          <h1>Connexion</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              identifiant :
              <input
                type="text"
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
                required
              />
            </label>

            <label>
              Mot de passe :
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button className="submit-button" type="submit">
              Continuer
            </button>
          </form>

          {submitted && loginStatus === 'success' && (
            <div className="submitted-banner success">
              Connexion réussie !
            </div>
          )}

          {submitted && loginStatus === 'error' && (
            <div className="submitted-banner error">
              Identifiant ou mot de passe incorrect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
