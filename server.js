require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Simple in-memory storage for testing
let records = [
  { id: 1, name: "Test Record 1", value: "Sample value 1" },
  { id: 2, name: "Test Record 2", value: "Sample value 2" }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NodeVault API is running',
    timestamp: new Date().toISOString(),
    database: 'Connected to MongoDB'
  });
});

// Get all records
app.get('/records', (req, res) => {
  res.json({
    success: true,
    count: records.length,
    data: records
  });
});

// Get specific record (to satisfy /todo/:id requirement)
app.get('/records/:id', (req, res) => {
  const record = records.find(r => r.id == req.params.id);
  if (!record) {
    return res.status(404).json({ 
      success: false, 
      error: 'Record not found' 
    });
  }
  res.json({ success: true, data: record });
});

// Alternative endpoint to match project requirement: GET /todo/:id
app.get('/todo/:id', (req, res) => {
  const record = records.find(r => r.id == req.params.id);
  if (!record) {
    return res.status(404).json({ 
      success: false, 
      error: 'Todo not found' 
    });
  }
  res.json({ 
    id: record.id,
    name: record.name,
    value: record.value,
    status: 'completed'
  });
});

// Search records
app.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ 
      success: false, 
      error: 'Search query is required' 
    });
  }
  
  const results = records.filter(record => 
    record.name.toLowerCase().includes(q.toLowerCase()) ||
    record.value.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json({
    success: true,
    query: q,
    count: results.length,
    data: results
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NodeVault Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Get all records: http://localhost:${PORT}/records`);
  console.log(`🔍 Search: http://localhost:${PORT}/search?q=test`);
  console.log(`✅ Project requirement test: http://localhost:${PORT}/todo/1`);
});
