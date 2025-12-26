const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { pets: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Nutzer' });
  }
};