import React from 'react';
import { useNavigate } from 'react-router-dom';

const Archives = () => {
  const navigate = useNavigate();

  const schedule = [
    { time: '08:00 - 10:00', mon: 'Théorie du lancer de PC', tue: 'Optimisation de sieste en amphi', wed: 'Hack de machine à café', thu: 'Psychologie du badge perdu', fri: 'Droit du Wi-Fi absent' },
    { time: '10:15 - 12:15', mon: 'Manipulation d\'IZLY', tue: 'Gestion de crise (Panne Twix)', wed: 'Algorithmique du CROUS', thu: 'Archivage de memes B3', fri: 'Soutenance de sommeil' },
    { time: '13:30 - 15:30', mon: 'Expertise Cantine (Niveau 1)', tue: 'Esquive de surveillant', wed: 'Soudure de câble RJ45 au briquet', thu: 'Développement de flemme aiguë', fri: 'Atelier: "C\'est pas moi c\'est le serveur"' },
    { time: '15:45 - 17:45', mon: 'Recherche de salle fantôme', tue: 'Cryptographie des notes Yparéo', wed: 'Physique des chaises cassées', thu: 'Histoire secrète de Sophia', fri: 'Libération anticipée (Week-end)' },
  ];

  return (
    <div className="archives-container">
      <header className="archives-header">
        <div className="logo-section" onClick={() => navigate('/')}>
          <span className="scip-logo">SCiPnet</span>
          <span className="portal-title">Portail Planification Campus</span>
        </div>
        <div className="user-profile">
          <span>Étudiant: [ACCÈS ANONYME]</span>
        </div>
      </header>

      <main className="archives-main">
        <h1>Emploi du Temps Hebdomadaire - Bâtiment A</h1>
        <p className="notice">Note: Les cours de "Lutte contre les courants d'air" sont déplacés en amphi C.</p>

        <div className="schedule-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Heure</th>
                <th>Lundi</th>
                <th>Mardi</th>
                <th>Mercredi</th>
                <th>Jeudi</th>
                <th>Vendredi</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, index) => (
                <tr key={index}>
                  <td className="time-slot">{row.time}</td>
                  <td>{row.mon}</td>
                  <td>{row.tue}</td>
                  <td>{row.wed}</td>
                  <td>{row.thu}</td>
                  <td>{row.fri}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* The hidden hint for Part 2 */}
        <div className="hidden-hint-wrapper">
          <p className="hidden-hint">
            Le code d'accès est le prix exact d'un Twix au distributeur du rez-de-chaussée.
          </p>
        </div>
      </main>

      <footer className="archives-footer">
        <p>© 2026 Service Technique Ynov - "Le futur est ici, quand le Wi-Fi marche."</p>
      </footer>

      <style>{`
        .archives-container {
          min-height: 100vh;
          background-color: #f4f7f6;
          color: #333;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .hidden-hint-wrapper {
          margin-top: 40px;
          text-align: center;
          padding: 20px;
          border-top: 1px dashed #eee;
        }
        .hidden-hint {
          color: #f4f7f6; /* Identique au fond */
          font-size: 0.85rem;
          cursor: default;
          user-select: text;
          transition: background 0.3s;
        }
        .hidden-hint::selection {
          background-color: #ff4b2b;
          color: white;
        }
        /* Pour Firefox */
        .hidden-hint::-moz-selection {
          background-color: #ff4b2b;
          color: white;
        }
        .archives-header {
          background-color: #1a1a1a;
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #ff4b2b;
        }
        .scip-logo {
          font-weight: bold;
          font-size: 1.5rem;
          color: #ff4b2b;
          margin-right: 15px;
          cursor: pointer;
        }
        .portal-title {
          font-size: 1.1rem;
          border-left: 1px solid #444;
          padding-left: 15px;
        }
        .archives-main {
          max-width: 1100px;
          margin: 40px auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .archives-main h1 {
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 1.8rem;
        }
        .notice {
          background: #fff3cd;
          color: #856404;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 25px;
          font-size: 0.9rem;
          border-left: 4px solid #ffeeba;
        }
        .schedule-wrapper {
          overflow-x: auto;
        }
        .schedule-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .schedule-table th, .schedule-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
          font-size: 0.9rem;
        }
        .schedule-table th {
          background-color: #f8f9fa;
          color: #2c3e50;
          font-weight: 600;
        }
        .time-slot {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #555;
          width: 120px;
        }
        .schedule-table tr:hover {
          background-color: #f1f1f1;
        }
        .archives-footer {
          text-align: center;
          padding: 20px;
          color: #777;
          font-size: 0.8rem;
        }
        @media (max-width: 768px) {
          .archives-main { margin: 10px; padding: 15px; }
        }
      `}</style>
    </div>
  );
};

export default Archives;
