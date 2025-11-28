// This handles Socket.io events for chat and WebRTC signaling
// Actual Socket.io setup is in server.js

exports.initiateChat = (socket, io) => {
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit('userJoined', socket.id);
  });

  socket.on('sendMessage', ({ roomId, message }) => {
    io.to(roomId).emit('receiveMessage', message);
  });
};

exports.initiateWebRTC = (socket, io) => {
  socket.on('offer', ({ offer, roomId }) => {
    io.to(roomId).emit('offer', offer);
  });

  socket.on('answer', ({ answer, roomId }) => {
    io.to(roomId).emit('answer', answer);
  });

  socket.on('iceCandidate', ({ candidate, roomId }) => {
    io.to(roomId).emit('iceCandidate', candidate);
  });
};