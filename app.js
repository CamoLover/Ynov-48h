const express = require('express');
const path = require('path');

const app = express();

console.log('Starting Escape From Ynov server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Directory:', __dirname);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// For standalone mode
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
