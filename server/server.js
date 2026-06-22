const app = require("./app");
const http = require("http");
const socketio = require("./socket");
const { processRecurring } = require("./controllers/recurringController");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketio.init(server);

io.on('connection', socket => {
  console.log('🔌 Client connected:', socket.id);

  // Join user-specific room for targeted events
  socket.on('join', (userId) => {
    if (userId) socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// #10 Recurring donation processor - check every 5 minutes
setInterval(processRecurring, 5 * 60 * 1000);
console.log('🔄 Recurring donation processor started (5 min interval)');

server.listen(PORT, () => {
  console.log(`🚀 Ann Raksha API v2.0 running on port ${PORT}`);
  console.log(`📊 Features: Rate limiting, Validation, Chat, QR, Export, Recurring`);
});