const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Update this with your frontend URL
  },
  pingInterval: 25000, // Ping every 25 seconds
  pingTimeout: 60000, // Connection is considered lost if no pong is received within 60 seconds
});

let users = [];

// Add a new user
const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
    console.log(`User added: ${userId} with socket ID: ${socketId}`);
  }
};

// Remove a user
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
  console.log(`User with socket ID: ${socketId} removed`);
};

// Get a user
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("A user connected.");

  // Take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
    console.log("Users after adding:", users); // Debug log
  });

  // Send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text, chatId }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message", {
        senderId,
        text,
        chatId,
      });
      console.log(`Message sent from ${senderId} to ${receiverId}: ${text}`);
    } else {
      console.log(`User with id ${receiverId} not found`);
    }
  });

  // When disconnect
  socket.on("disconnect", (reason) => {
    console.log(`A user disconnected due to: ${reason}`);
    removeUser(socket.id);
    io.emit("getUsers", users);
    console.log("Users after removing:", users); // Debug log
  });

  // Error handling
  socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
  });

  socket.on("reconnect_attempt", () => {
    console.log("Reconnecting attempt...");
  });

  socket.on("reconnect_failed", () => {
    console.error("Reconnection failed");
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
