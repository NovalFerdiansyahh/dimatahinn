const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const menuItemsRoutes = require('./routes/menuItems');
const sambalsRoutes = require('./routes/sambals');
const contactRoutes = require('./routes/contact');
const path = require('path');
 // Tambahkan ini

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/menuItems', menuItemsRoutes);
app.use('/sambals', sambalsRoutes);
app.use('/contact', contactRoutes); // Tambahkan ini
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
