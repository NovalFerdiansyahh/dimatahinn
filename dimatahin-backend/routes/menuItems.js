const express = require('express');
const router = express.Router();
const db = require('../db');
const upload = require('../multerConfig');

// Rute untuk mendapatkan semua item menu
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menu_items');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rute untuk mendapatkan satu item menu berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menu_items WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cannot find menu item' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rute untuk membuat item menu baru dengan pengunggahan gambar
router.post('/', upload.single('image'), async (req, res) => {
  const { name, size, price, description } = req.body;
  const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

  try {
    const [result] = await db.query('INSERT INTO menu_items (name, size, price, description, image_url) VALUES (?, ?, ?, ?, ?)', [name, size, price, description, imageUrl]);
    res.status(201).json({ id: result.insertId, name, size, price, description, image_url: imageUrl });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', upload.single('image'), async (req, res) => {
  const { name, size, price, description } = req.body;
  const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

  try {
    const [currentRows] = await db.query('SELECT * FROM menu_items WHERE id = ?', [req.params.id]);
    if (currentRows.length === 0) {
      return res.status(404).json({ message: 'Cannot find menu item' });
    }
    
    const currentItem = currentRows[0];
    const updatedImageUrl = imageUrl ? imageUrl : currentItem.image_url;

    const [result] = await db.query(
      'UPDATE menu_items SET name = ?, size = ?, price = ?, description = ?, image_url = ? WHERE id = ?',
      [name || currentItem.name, size || currentItem.size, price || currentItem.price, description || currentItem.description, updatedImageUrl, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cannot find menu item' });
    }
    res.json({ message: 'Menu item updated' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rute untuk menghapus item menu
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM menu_items WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cannot find menu item' });
    }
    res.json({ message: 'Deleted Menu Item' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
