
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));

let clients = [];

wss.on('connection', (ws) => {
  ws.role = 'client';
  clients.push(ws);

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.error('Invalid message:', message);
      return;
    }

    if (data.type === 'identify' && data.role === 'admin') {
      ws.role = 'admin';
      console.log('Admin connected');
      return;
    }

    if (ws.role === 'admin') {
      if (data.type === 'color' || data.type === 'effect' || data.type === 'text') {
        const zone = data.zone || null;

        clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN && (zone === null || zone.includes(client.zone))) {
            client.send(JSON.stringify(data));
          }
        });
      }
    }

    if (data.type === 'join' && data.zone) {
      ws.zone = data.zone;
    }
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

server.listen(PORT, () => {
  console.log('Serveur  exécuté  sur  le port', PORT);
});
