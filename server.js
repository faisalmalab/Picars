const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());
const express = require('express');
const http = require('http');
const path = require('path'); // Added
const { Server } = require('socket.io');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Serve Frontend Static Web Files
app.use(express.static(path.join(__dirname, 'public'))); // Serve Dashboard

// ... keep rest of PostgreSQL pool and API endpoints unchanged
// PostgreSQL Connection Pool
const pool = new Pool({
  user: 'postgres',         // Replace with your DBeaver username
  host: 'localhost',
  database: 'postgres',     // Replace with your database name in DBeaver
  password: 'yourpassword', // Replace with your PostgreSQL password
  port: 5432,
});

// Ingestion Endpoint for Edge AI Nodes
app.post('/api/v1/telemetry/alert', async (req, res) => {
  try {
    const { node_id, timestamp, in_zone_count, total_detected, objects } = req.body;
    const formattedTime = new Date(timestamp * 1000).toISOString();

    const query = `
      INSERT INTO intrusion_logs (node_id, timestamp, in_zone_count, total_detected, objects_payload)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [node_id, formattedTime, in_zone_count, total_detected, JSON.stringify(objects)];
    const dbResult = await pool.query(query, values);

    const savedLog = dbResult.rows[0];

    // Broadcast live event over WebSockets
    io.emit('telemetry:intrusion_alert', savedLog);

    return res.status(201).json({ status: 'success', data: savedLog });
  } catch (error) {
    console.error('Error logging telemetry payload:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch Audit Logs
app.get('/api/v1/telemetry/logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM intrusion_logs ORDER BY timestamp DESC LIMIT 50');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Telemetry Gateway Server running on http://localhost:${PORT}`);
});