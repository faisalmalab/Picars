const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Endpoint where Python (main.py) pushes telemetry data
app.post('/api/v1/telemetry/alert', (req, res) => {
  const telemetryData = req.body;
  
  // Broadcast telemetry to all connected frontend React clients
  io.emit("telemetry:intrusion_alert", telemetryData);
  
  console.log(`📡 Relayed Telemetry | FPS: ${telemetryData.fps} | In-Zone: ${telemetryData.in_zone_count}`);
  res.status(200).json({ status: "success", received: true });
});

io.on('connection', (socket) => {
  console.log(`Frontend client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Frontend client disconnected: ${socket.id}`);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});