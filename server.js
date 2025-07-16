const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/client', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.html'));
});

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Broadcasting:', data);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (err) {
      console.error('Invalid message:', message);
    }
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:3000');
});
