const express = require("express");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server (server, {
  cors: {
    origin: 'http://localhost:3000', // Remplacez par votre origine frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

const users = {};

// Gestion des connexions WebSocket
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
      return next(new Error("Nom d'utilisateur requis"));
  }
  socket.username = username;
  next();
});

io.on('connection', (socket) => {
  console.log(`New client connected ${socket.id}`);

  socket.on('send_message', (data) => {
    socket.broadcast.emit('new_message', {
      username: socket.username,
      message: data
    });
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected ${socket.id}`);
  });
});

// Démarrer le serveur
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});