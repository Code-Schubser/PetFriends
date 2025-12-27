const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // NEU: Import für Sicherheit
const prisma = new PrismaClient();

// Bestehende Funktion (alle abrufen)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { pets: true } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Nutzer' });
  }
};

// NEU: Registrierungs-Logik
exports.registerUser = async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  try {
    // 1. Passwort hashen (Sicherheitsstufe 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. In Datenbank speichern
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword, // Sicher gespeichert!
        firstName,
        lastName,
        role: role || 'PRIVAT'
      }
    });

    res.status(201).json({ message: "Nutzer erfolgreich erstellt", userId: newUser.id });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Diese E-Mail wird bereits verwendet.' });
    }
    res.status(500).json({ error: 'Fehler bei der Registrierung' });
  }
};