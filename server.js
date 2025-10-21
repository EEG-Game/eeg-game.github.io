// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5173;

// (Optional) permissive CORS for dev — not required if everything is same-origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // dev only
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Serve everything in this folder (index.html, /style, /src, /assets, etc.)
app.use(express.static(path.join(__dirname)));

// Fallback to index.html (handy if you ever add client-side routing)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dev server running: http://localhost:${PORT}`);
});

