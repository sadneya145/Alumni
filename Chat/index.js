const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');
const Chat = require('./model/chat'); 

const app = express();
const port = 4000;
const server = app.listen(port, () => console.log(`💬 Server running on port ${port}`));

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000', // ✅ Allow frontend requests
    methods: ['GET', 'POST']
  }
});

app.use(cors()); // ✅ Allow CORS
app.use(express.json()); // ✅ Keep this to parse JSON requests

// ✅ MongoDB Connection with Error Handling
mongoose.connect('mongodb+srv://sadneyasam05:root@cluster0.7gxwyxh.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Track connected sockets
let socketsConnected = new Set();

io.on('connection', (socket) => {
  console.log('🔗 Socket connected:', socket.id);
  socketsConnected.add(socket.id);
  io.emit('clients-total', socketsConnected.size);

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
    socketsConnected.delete(socket.id);
    io.emit('clients-total', socketsConnected.size);
  });

  socket.on('message', async (data) => {
    try {
      const { user, message, room } = data;
      const chatMessage = new Chat({ user, message, room, timestamp: new Date() });
      await chatMessage.save();
      io.to(room).emit('chat-message', data);
    } catch (error) {
      console.error('❌ Error saving message:', error);
    }
  });

  socket.on('join-room', async (room) => {
    socket.join(room);
    console.log(`🚪 Socket ${socket.id} joined room ${room}`);

    try {
      const messages = await Chat.find({ room }).sort({ timestamp: 1 });
      socket.emit('chat-history', messages);
    } catch (error) {
      console.error('❌ Error fetching chat history:', error);
    }
  });
  socket.on("typing", ({ username, room }) => {
    socket.to(room).emit("typing", username);
  });
  
  socket.on("stopped-typing", (room) => {
    socket.to(room).emit("stopped-typing");
  });
  
  

  socket.on("read-message", (messageId) => {
    io.emit("message-read", messageId);
  });

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data);
  });
});

// ✅ API endpoint to fetch chat messages
app.get('/api/chat/:room', async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await Chat.find({ room }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
