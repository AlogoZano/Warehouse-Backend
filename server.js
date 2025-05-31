require('dotenv').config();
const app = require('./src/app');
const http = require('http');

// const {Server} = require('socket.io');

const PORT_frontend = 3000;
const PORT_ESP = 3001;

// WebSockets
const server = http.createServer(app);

//Socket.io
// const io = new Server(server, {
//     cors: {

//         origin: '*',
//     }
// });

// app.set('io', io);


// io.on('connection', (socket) => {
//     console.log('New client connected: ', socket.id);

// });


server.listen(PORT_frontend, '0.0.0.0', () => {
    console.log('Server con patas Corriendo');
});