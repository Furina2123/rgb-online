const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let admin = null;
const clients = new Set();

wss.on('connection', (ws, req) => {
  ws.isAdmin = false;

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === 'identify' && data.role === 'admin') {
        admin = ws;
        ws.isAdmin = true;
        console.log('Admin connected');
        return;
      }

      if (!ws.isAdmin) return; // Only admin can send commands

      // Broadcast commands to all clients
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });

    } catch (e) {
      console.error('Invalid message', e);
    }
  });

  ws.on('close', () => {
    if (ws.isAdmin) {
      console.log('Admin disconnected');
      admin = null;
    } else {
      clients.delete(ws);
    }
  });

  if (!ws.isAdmin) {
    clients.add(ws);
    console.log('Client connected');
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
