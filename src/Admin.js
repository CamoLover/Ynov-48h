import './Admin.css';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>PANNEAU ADMINISTRATEUR</h1>
          <p className="warning-text">Cette page ne fait pas partie du jeu</p>
        </div>

        <div className="admin-content">
          <p className="placeholder-text">Zone administrative - En cours de développement</p>
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
