const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('New client connected: ', socket.id);
});

server.listen(3002, () => {
  console.log('Server running on port 3000');
});

module.exports = io;


















