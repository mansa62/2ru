const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // فایل‌های استاتیک (HTML, CSS, JS)

// کاربران آنلاین
let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // کاربر جدید وارد اتاق شد
  socket.on('join', (username) => {
    if (username) {
      onlineUsers.push({ id: socket.id, username });
      io.emit('updateUserList', onlineUsers);
      console.log(`${username} joined`);
    }
  });

  // ارسال صدا
  socket.on('voice', (data) => {
    socket.broadcast.emit('voice', data); // ارسال صدا به سایر کاربران
  });

  // جدا شدن کاربر
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
    io.emit('updateUserList', onlineUsers);
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
