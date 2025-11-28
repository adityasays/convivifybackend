const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const questionnaireRoutes = require('./routes/questionnaireRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const { initiateChat, initiateWebRTC } = require('./controllers/communicationController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' },
});

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/communication', communicationRoutes);

io.on('connection', (socket) => {
  console.log('User connected');
  initiateChat(socket, io);
  initiateWebRTC(socket, io);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));