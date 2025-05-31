
const WebSockets = require('ws');
const newRSSI = require('./src/services/espService')

const PORT_ESP = 3001;

const webSocketServer = new WebSockets.Server({port: PORT_ESP}, () => {
  console.log('ESP server corriendo');
});

webSocketServer.on('connection', (ws, req) => {
    const clientIP = req.socket.remoteAddress;
    console.log(`Cliente conectado: ${clientIP}`);
    
    ws.on('message', (data) => {
      let ESP;
  
      try{
        ESP = JSON.parse(data);
        console.log(ESP);
      }catch(e){
        console.warn('Error al leer rssi');
      }
  
      const antena = ESP.antena;
      const rssi = ESP.rssi;
      
      console.log(`Mensaje recibido de antena ${antena}`);

      newRSSI(antena, rssi, ws);

      const textoRecibido = data.toString();
      ws.send(`Echo: ${textoRecibido}`);
    });                  
  
    ws.on('close', () => {
      console.log(`Cliente desconectado: ${clientIP}`);
    });
  
    ws.on('error', (err) => {
      console.error('Error WebSocket:', err);
    });
  });

  module.exports = webSocketServer;