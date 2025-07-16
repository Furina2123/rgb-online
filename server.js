const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map();

const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

wss.on('connection', (ws, req) => {
  clients.set(ws, { zone: 'default' });

  ws.on('message', message => {
    try {
      const msg = JSON.parse(message);

      if (msg.type === 'register') {
        clients.set(ws, { zone: msg.zone || 'default' });
        return;
      }

      if (msg.type === 'admin') {
        const targetZones = msg.zone && msg.zone.length ? msg.zone : null;
        clients.forEach((info, client) => {
          if (client.readyState === WebSocket.OPEN) {
            if (!targetZones || targetZones.includes(info.zone)) {
              client.send(JSON.stringify(msg));
            }
          }
        });
        return;
      }

    } catch (e) {
      console.error('Invalid message:', e);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
