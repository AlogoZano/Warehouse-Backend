require('dotenv').config();
const app = require('./src/app');
const http = require('http');

const {Server} = require('socket.io');


const PORT = 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('New client connected: ', socket.id);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('Server con patas Corriendo');
});