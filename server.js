const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
