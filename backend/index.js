const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 2. Routen-Module importieren und nutzen
// Hier sagen wir: Alles was mit /api/users beginnt -> userRoutes
app.use('/api/users', require('./routes/userRoutes'));

// Alles was mit /api/pets beginnt -> petRoutes
app.use('/api/pets', require('./routes/petRoutes'));

// Test-Endpunkt bleibt für schnellen Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'PetFriends Server läuft modular!' });
});

// 3. Server-Start
app.listen(PORT, () => {
  console.log(`Server läuft modular auf http://localhost:${PORT}`);
});