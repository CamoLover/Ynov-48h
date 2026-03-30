const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Determine if we're in production or development
const isDevelopment = process.env.NODE_ENV !== 'production';

// Configure Socket.IO with appropriate CORS settings
const io = new Server(server, {
  cors: {
    origin: isDevelopment ? "http://localhost:3000" : "https://escape-from-ynov.camolover.dev",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// API routes or other Express middleware can go here
app.use(express.json());

// Track connected clients
let connectedClients = 0;

io.on('connection', (socket) => {
  connectedClients++;
  console.log(`Client connected: ${socket.id} (Total: ${connectedClients})`);

  // Notify all admins of new connection
  io.emit('client-count', connectedClients);

  // Handle admin sending notification
  socket.on('send-notification', (data) => {
    console.log('Broadcasting notification:', data);
    // Send to all clients except sender
    socket.broadcast.emit('notification', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    connectedClients--;
    console.log(`Client disconnected: ${socket.id} (Total: ${connectedClients})`);
    io.emit('client-count', connectedClients);
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
// Passenger will provide the PORT via environment variable
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${isDevelopment ? 'development' : 'production'} mode`);
  console.log(`WebSocket server active`);

  // Tell Passenger we're ready if running under Passenger
  if (typeof(PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
  }
});

// Export the server for compatibility
module.exports = server;
