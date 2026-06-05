const app = require("./app");
const connectDB = require("./config/db");
const http = require("http");
const socketio = require("./socket");

connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketio.init(server);

io.on('connection', socket => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});