const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPet = async (req, res) => {
  const { name, species, breed, ownerId } = req.body;
  
  // Wir schauen nach, ob Multer eine Datei in req.file abgelegt hat
  let imageUrl = null;
  if (req.file) {
    // Wir speichern den Pfad, unter dem das Bild erreichbar ist
    imageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const newPet = await prisma.petProfile.create({
      data: {
        name,
        species,
        breed,
        ownerId: parseInt(ownerId),
        imageUrl: imageUrl // Hier wird der Pfad gespeichert
      }
    });
    res.json(newPet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fehler beim Erstellen des Tieres" });
  }
};

exports.deletePet = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.petProfile.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Haustier erfolgreich gelöscht' });
  } catch (error) {
    console.error("Löschfehler:", error);
    res.status(500).json({ error: 'Fehler beim Löschen des Haustiers' });
  }

};

exports.updatePet = async (req, res) => {
  const { id } = req.params;
  const { name, species, breed, description } = req.body;
  try {
    const updatedPet = await prisma.petProfile.update({
      where: { id: parseInt(id) },
      data: { name, species, breed, description }
    });
    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Haustiers' });
  }
};