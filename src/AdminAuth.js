import './AdminAuth.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const ADMIN_PASSWORD_HASH = "$2a$12$gOQdT4.NOUXSONbxlz7J3.PO3GcB5mBB00ffsYUU0wAVGdPER9H8S";

function AdminAuth() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

      if (isValid) {
        navigate('/admin/dashboard');
      } else {
        setError('Mot de passe incorrect');
        setPassword('');
      }
    } catch (err) {
      setError('Erreur de vérification');
      setPassword('');
    }
  };

  return (
    <div className="admin-auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1>ACCÈS ADMINISTRATEUR</h1>
          <p className="warning-text">Cette page ne fait pas partie du jeu</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">Mot de passe:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              autoFocus
              spellCheck="false"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="submit" className="submit-btn">
              CONNEXION
            </button>
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate('/')}
            >
              RETOUR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminAuth;
