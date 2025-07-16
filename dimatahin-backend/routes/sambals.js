const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all sambals
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sambals');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new sambal
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.query('INSERT INTO sambals (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a sambal
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  try {
    const [result] = await db.query('UPDATE sambals SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cannot find sambal' });
    }
    res.json({ message: 'Updated Sambal' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a sambal
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM sambals WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cannot find sambal' });
    }
    res.json({ message: 'Deleted Sambal' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
