const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all locations
router.get('/', (req, res) => {
  db.all('SELECT * FROM locations ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST a new location
router.post('/', (req, res) => {
  const { name, lat, lon } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const sql = 'INSERT INTO locations (name, lat, lon) VALUES (?, ?, ?)';
  db.run(sql, [name, lat, lon], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      name,
      lat,
      lon
    });
  });
});

// PUT (update) a location
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name, lat, lon } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const sql = 'UPDATE locations SET name = ?, lat = ?, lon = ? WHERE id = ?';
  db.run(sql, [name, lat, lon, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ id, name, lat, lon });
  });
});

// DELETE a location
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  
  const sql = 'DELETE FROM locations WHERE id = ?';
  db.run(sql, id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  });
});

module.exports = router;
