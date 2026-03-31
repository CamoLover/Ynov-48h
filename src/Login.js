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
        identifiant: 'joueur13',
        password: 'joueur13',
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
            <div className="" style={{ display: 'none' }} id="joueur" password="joueur" />
            <div className="login-card">
                <div className="left-panel">
                    <div className="top-row">
                        <svg className="logo" xmlns='http://www.w3.org/2000/svg' baseProfile="tiny" viewBox='0 0 140.3 70.3' >
                            <g>
                                <path d="M45.4,57.1c-2.2,0-3.9-1.8-3.9-4.1c0-2.3,1.7-4,3.9-4c1.1,0,2.3,0.6,3.1,1.5l1.1-1.4c-1.1-1.1-2.6-1.8-4.2-1.8
                                    c-3.3,0-5.8,2.5-5.8,5.8c0,3.3,2.5,5.8,5.7,5.8c1.6,0,3.2-0.7,4.3-1.9l-1.1-1.3C47.7,56.6,46.5,57.1,45.4,57.1z"></path>
                                <path d="M56.8,47.4L52,58.9h1.9l1.1-2.6h5.6l1.1,2.6h2l-4.8-11.5H56.8z M55.6,54.5l2.1-5.1l2.1,5.1H55.6z"></path>
                                <polygon points="72.9,55 69.2,47.4 67,47.4 67,58.9 68.8,58.9 68.8,50.3 72.2,57.7 73.5,57.7 76.9,50.3 76.9,58.9 78.7,58.9 
                                    78.7,47.4 76.5,47.4 	"></polygon>
                                <path d="M88,47.4h-4.4v11.5h1.9v-3.5H88c2.8,0,4.4-1.5,4.4-4.1C92.3,48.8,90.7,47.4,88,47.4z M87.9,53.7h-2.5v-4.5h2.5
                                    c1.7,0,2.7,0.7,2.7,2.2C90.5,52.9,89.6,53.7,87.9,53.7z"></path>
                                <path d="M103.7,54.1c0,2-1.1,3.1-2.9,3.1c-1.8,0-3-1.2-3-3.1v-6.7h-1.9v6.7c0,3,1.8,4.8,4.8,4.8c3,0,4.8-1.8,4.8-4.8v-6.7h-1.9
                                    V54.1z"> </path>
                                <path d="M111.9,50.3c0-0.8,0.7-1.2,1.8-1.2c0.8,0,2,0.3,3.2,1.1l0.8-1.7c-1-0.7-2.4-1.2-3.9-1.2c-2.4,0-4,1.2-4,3.2
                                    c0,4.1,6,2.7,6,5.2c0,0.9-0.8,1.4-2.1,1.4c-1.2,0-2.6-0.6-3.7-1.7l-0.8,1.7c1.1,1.1,2.8,1.8,4.5,1.8c2.4,0,4.2-1.3,4.2-3.3
                                    C117.8,51.5,111.9,52.8,111.9,50.3z"></path>
                                <path d="M86.1,40.2c8,0,14.5-6.4,14.5-14.4s-6.5-14.4-14.5-14.4c-8,0-14.5,6.4-14.5,14.4S78.1,40.2,86.1,40.2z M86.1,18.2
                                    c4.2,0,7.6,3.4,7.6,7.5c0,4.2-3.4,7.5-7.6,7.5c-4.2,0-7.6-3.4-7.6-7.5C78.5,21.6,81.9,18.2,86.1,18.2z"></path>
                                <path d="M39.7,40.2h6.9l0-14c0-4.3,3.4-7.7,7.6-7.7c4.2,0,7.6,3.4,7.6,7.7v14h6.9l0-14c0-8.1-6.5-14.7-14.5-14.7
                                    c-8,0-14.5,6.6-14.5,14.7V40.2z"></path>
                                <path d="M24.1,26.4c0-1-0.2-1.9-0.5-2.7l-4.7-12.2h-7.4L19.7,33C22.3,32,24.1,29.4,24.1,26.4z"></path>
                                <polygon points="117.8,40.2 128.8,11.5 121.4,11.5 110.4,40.2 	"></polygon>
                                <path d="M112,26.4c0-1-0.2-1.9-0.5-2.7l-4.7-12.2h-7.4l8.3,21.5C110.2,32,112,29.4,112,26.4z"></path>
                                <polygon points="33.5,11.5 15.3,58.9 22.7,58.9 40.9,11.5 	"></polygon>

                            </g>
                        </svg>

                        <svg className="EICAR" xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 151 52" fill="none">
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
        </div >
    );
}

export default Login;
