const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'PetFriends Server läuft!' });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});