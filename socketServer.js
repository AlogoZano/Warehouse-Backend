
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
    
      try {
        ESP = JSON.parse(data);
      } catch (e) {
        console.warn('Error al leer JSON desde ESP:', e);
        return;
      }
    
      // Si position viene como string (ej. "[0.0, 0.0]"), lo convertimos a array
      if (typeof ESP.posicion === 'string') {
        console.log("ES STRING!!");
        try {
          ESP.posicion = JSON.parse(ESP.posicion);
        } catch (e) {
          console.warn(
            `Warning: ESP.position no es un JSON válido: ${ESP.posicion}`
          );
          // Podrías asignar un valor por defecto o salir aquí:
          // return;
        }
      }
    
      // Ahora ESP.position es realmente un array (p.ej. [0.0, 0.0])
      const antena = ESP.antena;
      console.log(`Mensaje recibido de antena ${antena}:`, ESP);
    
      newRSSI(antena, ESP, ws);
      ws.send(`Echo: ${data.toString()}`);
    });
    
                      
  
    ws.on('close', () => {
      console.log(`Cliente desconectado: ${clientIP}`);
    });
  
    ws.on('error', (err) => {
      console.error('Error WebSocket:', err);
    });
  });

  module.exports = webSocketServer;