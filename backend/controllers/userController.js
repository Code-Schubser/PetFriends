const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// 1. REGISTRIERUNG
exports.register = async (req, res) => {
  // Wir holen jetzt auch "role" aus dem req.body
  const { email, password, firstName, lastName, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        // Wenn eine Rolle mitgeschickt wird (vom Admin), nimm diese. 
        // Wenn nicht (beim Login-Screen), nimm automatisch 'PRIVAT'.
        role: role || 'PRIVAT'
      }
    });
    res.status(201).json({ message: "Nutzer erstellt" });
  } catch (error) {
    console.error("PRISMA FEHLER:", error);
    res.status(400).json({ error: "Registrierung fehlgeschlagen" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Geändert: petProfile statt pet
    await prisma.petProfile.deleteMany({
      where: { ownerId: parseInt(id) }
    });

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Nutzer und seine Profile erfolgreich gelöscht" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fehler beim Löschen des Nutzers" });
  }
};

// 2. LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Nutzer nicht gefunden" });

    // Hier auch user.passwordHash nutzen statt user.password!
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) return res.status(401).json({ error: "Passwort falsch" });

    const { passwordHash: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Serverfehler beim Login" });
  }
};

// 3. ALLE NUTZER
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { pets: true } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Laden" });
  }
};