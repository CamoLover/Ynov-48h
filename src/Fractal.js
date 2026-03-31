import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Fractal.css';

const Fractal = () => {
  const canvasRef = useRef(null);
  const guidesRef = useRef(null);
  const animationFrameRef = useRef(null);
  const workerRef = useRef(null);

  const [popup, setPopup] = useState({ visible: false, text: '' });
  const [isRendering, setIsRendering] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(200);
  const [discoveredCodes, setDiscoveredCodes] = useState([]);
  const discoveredCodesRef = useRef(new Set());
  const [finalCode, setFinalCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const navigate = useNavigate();

  // Fractal state
  const stateRef = useRef({
    centerX: -0.5,
    centerY: 0,
    zoom: 200,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const maxIterations = 100;
  const minZoom = 150;
  const maxZoom = 5000000;

  // Secret spots with codes: ABCD (alphabetical order gives: PM73BB45AE67XR92)
  const secretSpots = [
    {
      x: -0.7486,
      y: 0.1,
      color: 'yellow',
      text: 'Code A: AE67',
      zoomThreshold: 4000000
    },
    {
      x: 0.374,
      y: -0.1432,
      color: 'cyan',
      text: 'Code B: BB45',
      zoomThreshold: 3000000
    }
  ];

  const secretRadius = 0.005;

  // Check if all codes are discovered
  const allCodesDiscovered = discoveredCodes.length === secretSpots.length;

  // Handle final code submission
  const handleFinalCodeSubmit = (e) => {
    e.preventDefault();
    const normalizedCode = finalCode.replace(/\s/g, '').toUpperCase();

    if (normalizedCode === 'AE67BB45' || normalizedCode === 'AE67 BB45'.replace(/\s/g, '')) {
      // Success! Navigate back to home with state
      navigate('/', { state: { fromFractal: true } });
    } else {
      // Show error
      setCodeError(true);
      setTimeout(() => setCodeError(false), 2000);
    }
  };

  // Color cache for performance
  const colorCacheRef = useRef(new Map());

  // HSL to RGB conversion (stable, no dependencies)
  const hslToRgb = (h, s, l) => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  // Get color with caching (stable, no dependencies)
  const getColor = (iteration) => {
    const cache = colorCacheRef.current;

    if (cache.has(iteration)) {
      return cache.get(iteration);
    }

    let color;
    if (iteration === maxIterations) {
      color = [0, 0, 0, 255];
    } else {
      const hue = (iteration % 50) / 50;
      const rgb = hslToRgb(hue, 0.8, 0.5);
      color = [...rgb, 255];
    }

    cache.set(iteration, color);

    // Clear cache if it gets too large
    if (cache.size > 10000) {
      cache.clear();
    }

    return color;
  };

  // Mandelbrot calculation (stable, no dependencies)
  const mandelbrot = (x0, y0) => {
    let x = 0;
    let y = 0;
    let x2 = 0;
    let y2 = 0;
    let iteration = 0;

    let period = 0;
    let x_old = 0;
    let y_old = 0;

    while (x2 + y2 <= 4 && iteration < maxIterations) {
      y = 2 * x * y + y0;
      x = x2 - y2 + x0;
      x2 = x * x;
      y2 = y * y;
      iteration++;

      if (x === x_old && y === y_old) {
        iteration = maxIterations;
        break;
      }
      period++;
      if (period > 20) {
        period = 0;
        x_old = x;
        y_old = y;
      }
    }

    if (iteration < maxIterations) {
      const log_zn = Math.log(x2 + y2) / 2;
      const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
      iteration = iteration + 1 - nu;
    }

    return iteration;
  };

  // Update guide positions (stable, no dependencies)
  const updateGuidePositions = () => {
    if (!guidesRef.current) return;

    const { centerX, centerY, zoom, width, height } = stateRef.current;
    const guides = guidesRef.current.children;

    secretSpots.forEach((spot, index) => {
      const guide = guides[index];
      if (!guide) return;

      const screenX = ((spot.x - centerX) * zoom) + width / 2;
      const screenY = ((spot.y - centerY) * zoom) + height / 2;

      const isVisible = screenX >= 0 && screenX <= width &&
                       screenY >= 0 && screenY <= height;

      guide.style.display = isVisible ? 'block' : 'none';
      if (isVisible) {
        guide.style.left = (screenX - 5) + 'px';
        guide.style.top = (screenY - 5) + 'px';
      }
    });
  };

  // Check secret spots (stable, no dependencies)
  const checkSecretSpots = (isZoomingIn) => {
    // Only show popup when zooming in, not zooming out
    if (!isZoomingIn) return;

    const { centerX, centerY, zoom } = stateRef.current;

    for (const spot of secretSpots) {
      const distance = Math.sqrt(
        Math.pow(centerX - spot.x, 2) +
        Math.pow(centerY - spot.y, 2)
      );

      if (distance < secretRadius && zoom > spot.zoomThreshold) {
        // Check if this code was already discovered using ref for immediate check
        if (!discoveredCodesRef.current.has(spot.text)) {
          // Mark as discovered immediately
          discoveredCodesRef.current.add(spot.text);

          // Add to discovered codes list
          setDiscoveredCodes(prev => [...prev, spot.text]);

          // Show popup
          setPopup({ visible: true, text: spot.text });

          // Auto-dismiss popup after 1 second
          setTimeout(() => {
            setPopup({ visible: false, text: '' });
          }, 1000);
        }
        return;
      }
    }
  };

  // Draw fractal with progressive rendering - use useRef to store the function
  const drawFractalRef = useRef();

  drawFractalRef.current = (scale = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const { centerX, centerY, zoom, width, height } = stateRef.current;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsRendering(true);

    const tempWidth = Math.floor(width / scale);
    const tempHeight = Math.floor(height / scale);
    const imageData = ctx.createImageData(tempWidth, tempHeight);
    const data = imageData.data;

    let py = 0;

    const renderLine = () => {
      const startTime = performance.now();

      while (py < tempHeight) {
        for (let px = 0; px < tempWidth; px++) {
          const x0 = (px * scale - width / 2) / zoom + centerX;
          const y0 = (py * scale - height / 2) / zoom + centerY;

          const iteration = mandelbrot(x0, y0);
          const index = (px + py * tempWidth) * 4;
          const color = getColor(iteration);

          data[index] = color[0];
          data[index + 1] = color[1];
          data[index + 2] = color[2];
          data[index + 3] = color[3];
        }
        py++;

        // Break after 16ms to keep UI responsive
        if (performance.now() - startTime > 16) {
          break;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      if (scale > 1) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, tempWidth, tempHeight, 0, 0, width, height);
      }

      if (py < tempHeight) {
        animationFrameRef.current = requestAnimationFrame(renderLine);
      } else {
        setIsRendering(false);

        // Progressive refinement: render at higher quality
        if (scale > 1) {
          const nextScale = scale === 4 ? 2 : 1;
          if (nextScale >= 1) {
            drawFractalRef.current(nextScale);
          }
        }
      }
    };

    renderLine();
    updateGuidePositions();
  };

  // Handle wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const state = stateRef.current;
    const fractalX = (mouseX - state.width / 2) / state.zoom + state.centerX;
    const fractalY = (mouseY - state.height / 2) / state.zoom + state.centerY;

    const isZoomingIn = e.deltaY < 0;
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    state.zoom = Math.max(minZoom, Math.min(maxZoom, state.zoom * zoomFactor));

    state.centerX = fractalX - (mouseX - state.width / 2) / state.zoom;
    state.centerY = fractalY - (mouseY - state.height / 2) / state.zoom;

    setZoomLevel(Math.round(state.zoom));
    drawFractalRef.current(4);
    checkSecretSpots(isZoomingIn);
  }, []);

  // Handle window resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the actual container size
    const container = canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width;
    canvas.height = height;

    stateRef.current.width = width;
    stateRef.current.height = height;

    drawFractalRef.current();
  }, []);

  // Initialize canvas and event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the actual container size
    const container = canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width;
    canvas.height = height;

    stateRef.current.width = width;
    stateRef.current.height = height;

    // Initial draw
    drawFractalRef.current(4);

    // Add event listeners
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleWheel, handleResize]);

  return (
    <div className="fractal-container">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-title">
            MEMETIC FRACTAL EXPLORER v1.0
          </div>
          <div className="terminal-buttons">
            <div className="terminal-button close"></div>
            <div className="terminal-button minimize"></div>
            <div className="terminal-button maximize"></div>
          </div>
        </div>

        <div className="terminal-content">
          <canvas ref={canvasRef} className="fractal-canvas" />

          <div className="instruction-text">
            Mettez les codes dans l'ordre alphabétique
            <div className="zoom-indicator">Zoom: {zoomLevel.toLocaleString()}x</div>
            {discoveredCodes.length > 0 && (
              <div className="discovered-codes">
                {discoveredCodes.map((code, index) => (
                  <div key={index} className="code-item">
                    {code}
                  </div>
                ))}
              </div>
            )}
          </div>

          {allCodesDiscovered && (
            <div className="final-code-input-container">
              <form onSubmit={handleFinalCodeSubmit} className="final-code-form">
                <input
                  type="text"
                  value={finalCode}
                  onChange={(e) => setFinalCode(e.target.value)}
                  placeholder="Entrez le code combiné (ex: AE67 BB45)"
                  className={`final-code-input ${codeError ? 'error' : ''}`}
                  autoFocus
                />
                <button type="submit" className="final-code-submit">
                  Valider
                </button>
              </form>
              {codeError && (
                <div className="code-error-message">
                  Code invalide ! Réessayez.
                </div>
              )}
            </div>
          )}

          <div ref={guidesRef} className="guides">
            {secretSpots.map((spot, index) => (
              <div
                key={index}
                className="guide-point"
                style={{ background: spot.color }}
              />
            ))}
          </div>

          {popup.visible && (
            <div className="popup">
              <span className="close-btn" onClick={() => setPopup({ visible: false, text: '' })}>
                &times;
              </span>
              <p className="secret-text">{popup.text}</p>
            </div>
          )}

          <div className="effects-overlay" />
        </div>
      </div>
    </div>
  );
};

export default Fractal;
