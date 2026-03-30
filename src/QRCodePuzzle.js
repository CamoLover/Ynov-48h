import React, { useState, useEffect } from 'react';
import './QRCodePuzzle.css';

const QRCodePuzzle = ({ onSolved, onCancel }) => {
  const [pieces, setPieces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    // Initialize pieces
    const initialPieces = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      correctPos: i,
    }));
    
    // Simple shuffle (guarantee it's not solved at start)
    let shuffled;
    const checkSolved = (arr) => arr.every((p, i) => p.id === i);
    
    do {
      shuffled = [...initialPieces]
        .map(p => ({ ...p, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({id}) => ({id}));
    } while (checkSolved(shuffled));
    
    setPieces(shuffled);
  }, []);

  const handlePieceClick = (index) => {
    if (isSolved) return;
    
    if (selected === null) {
      setSelected(index);
    } else {
      const newPieces = [...pieces];
      // Swap pieces in the array
      [newPieces[selected], newPieces[index]] = [newPieces[index], newPieces[selected]];
      
      setPieces(newPieces);
      setSelected(null);
      
      if (newPieces.every((p, i) => p.id === i)) {
        setIsSolved(true);
        setTimeout(() => onSolved(), 2000);
      }
    }
  };

  return (
    <div className="puzzle-container">
      <div className="puzzle-header">
        <h2 className="glitch-text" data-text="[!] BROUILLAGE ACTIF : RÉPAREZ LE QR CODE">[!] BROUILLAGE ACTIF : RÉPAREZ LE QR CODE</h2>
        <button className="cancel-btn" onClick={onCancel}>ABANDONNER</button>
      </div>
      <div className={`puzzle-grid ${isSolved ? 'is-solved' : ''}`}>
        {pieces.map((piece, index) => (
          <div
            key={piece.id}
            className={`puzzle-piece ${selected === index ? 'selected' : ''} ${isSolved ? 'solved' : ''}`}
            onClick={() => handlePieceClick(index)}
            style={{
              backgroundImage: `url('/qrcode_cafet.png')`,
              backgroundPosition: `${(piece.id % 4) * 33.33}% ${(Math.floor(piece.id / 4)) * 33.33}%`,
              backgroundSize: '400% 400%',
            }}
          />
        ))}
      </div>
      {isSolved && (
        <div className="scan-line-container">
          <div className="scan-line"></div>
          <div className="scan-status">SCANNING VALIDATED...</div>
        </div>
      )}
    </div>
  );
};

export default QRCodePuzzle;
