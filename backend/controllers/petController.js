const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPet = async (req, res) => {
  const { name, species, breed, description, birthdate, ownerId } = req.body;
  try {
    const newPet = await prisma.petProfile.create({
      data: {
        name,
        species,
        breed,
        description,
        birthdate: birthdate ? new Date(birthdate) : null,
        ownerId: parseInt(ownerId)
      }
    });
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Erstellen des Haustier-Profils' });
  }
};