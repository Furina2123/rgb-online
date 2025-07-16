const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('Client connected');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === "admin") {
                clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        if (!data.zone || (client.zone && data.zone.includes(client.zone))) {
                            client.send(JSON.stringify(data));
                        }
                    }
                });
            } else if (data.type === "zone_register") {
                ws.zone = data.zone;
            }
        } catch (e) {
            console.error("Invalid message", e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients = clients.filter(c => c !== ws);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));