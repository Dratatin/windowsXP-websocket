const express = require("express");
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server (server, {
  cors: {
    origin: process.env.CORS_ORIGIN_CLIENT, // Remplacez par votre origine frontend
    methods: ['GET', 'POST'],
  },
});

const users = {};

// Exiger un nom d'utilisateur avant la suite de l'exécution du script
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

  socket.broadcast.emit('user_connected', {
    username: socket.username,
  });

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