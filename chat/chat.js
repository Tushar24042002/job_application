export const chatHandler = (io) => {
    console.log('Server and Socket.io setup completed');
  
    io.on('connection', (socket) => {
      console.log('A user connected: ', socket.id);
  
      // Join a room
      socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
      });
  
      // Handle incoming messages
      socket.on('chatMessage', ({ room, message }) => {
        io.to(room).emit('chatMessage', message);
      });
  
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
      });
    });
  };
  