const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import koneksi database

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    console.log('Request body:', req.body); // Tambahkan log untuk request body
    const [result] = await pool.query(
      'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    console.log('Insert result:', result); // Tambahkan log untuk hasil insert
    res.json({ message: 'Pesan Anda telah diterima!' });
  } catch (error) {
    console.error('Database insert error:', error); // Tambahkan log untuk error
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
