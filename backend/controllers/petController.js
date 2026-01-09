const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. NEU: Discovery-Logik (Filtert bereits bewertete Tiere aus)
exports.getDiscoveryPets = async (req, res) => {
  const { sourcePetId } = req.query;
  try {
    const sId = parseInt(sourcePetId);
    if (!sId) return res.status(400).json({ error: "sourcePetId fehlt" });

    const ratedLikes = await prisma.like.findMany({
      where: { sourcePetId: sId },
      select: { targetPetId: true }
    });
    const ratedIds = ratedLikes.map(l => l.targetPetId);

    const myPet = await prisma.petProfile.findUnique({
      where: { id: sId },
      select: { ownerId: true }
    });

    const pets = await prisma.petProfile.findMany({
      where: {
        AND: [
          { id: { notIn: [...ratedIds, sId] } },
          { ownerId: { not: myPet.ownerId } }
        ]
      }
    });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: "Discovery-Fehler" });
  }
};

// 2. Diese Funktion hat gefehlt! (Wird von router.get('/') aufgerufen)
exports.getAllPets = async (req, res) => {
  try {
    const pets = await prisma.petProfile.findMany();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Laden aller Tiere" });
  }
};

exports.createPet = async (req, res) => {
  const { name, species, breed, ownerId, birthdate } = req.body;
  let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const newPet = await prisma.petProfile.create({
      data: {
        name, species, breed,
        birthdate: birthdate ? new Date(birthdate) : null,
        ownerId: parseInt(ownerId),
        imageUrl
      }
    });
    res.json(newPet);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Erstellen" });
  }
};

exports.deletePet = async (req, res) => {
  try {
    await prisma.petProfile.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Haustier erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Löschen' });
  }
};

exports.updatePet = async (req, res) => {
  const { id } = req.params;
  const { name, species, breed, description, birthdate, ownerId } = req.body;
  try {
    const updatedPet = await prisma.petProfile.update({
      where: { id: parseInt(id) },
      data: { 
        name, species, breed, description,
        birthdate: birthdate ? new Date(birthdate) : null,
        ownerId: ownerId ? parseInt(ownerId) : undefined
      }
    });
    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Update' });
  }
};

exports.ratePet = async (req, res) => { 
  const { sourcePetId, targetPetId, isLiked } = req.body;
  try {
    const sId = parseInt(sourcePetId);
    const tId = parseInt(targetPetId);
    const existingLike = await prisma.like.findFirst({
      where: { sourcePetId: sId, targetPetId: tId }
    });
    if (existingLike) return res.status(400).json({ error: "Bereits bewertet!" });

    await prisma.like.create({ data: { sourcePetId: sId, targetPetId: tId, isLiked } });

    let matchCreated = false;
    if (isLiked) {
      const counterLike = await prisma.like.findFirst({
        where: { sourcePetId: tId, targetPetId: sId, isLiked: true }
      });
      if (counterLike) {
        const existingMatch = await prisma.match.findFirst({
          where: { OR: [{ petAId: sId, petBId: tId }, { petAId: tId, petBId: sId }] }
        });
        if (!existingMatch) {
          await prisma.match.create({ data: { petAId: sId, petBId: tId } });
          matchCreated = true;
        }
      }
    }
    res.json({ success: true, isMatch: matchCreated });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Rating" });
  }
};

exports.getSpecies = async (req, res) => {
  try {
    const species = await prisma.petProfile.findMany({
      distinct: ['species'],
      select: { species: true },
    });
    res.json(species.map(s => s.species).sort());
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Laden der Arten" });
  }
};

exports.getMatchCount = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const count = await prisma.match.count({
      where: { OR: [{ petA: { ownerId: userId } }, { petB: { ownerId: userId } }] }
    });
    res.json({ count });
  } catch (error) {
    res.json({ count: 0 });
  }
};

exports.getUserMatches = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const myPets = await prisma.petProfile.findMany({ where: { ownerId: userId }, select: { id: true } });
    const myPetIds = myPets.map(p => p.id);
    const matches = await prisma.match.findMany({
      where: { OR: [{ petAId: { in: myPetIds } }, { petBId: { in: myPetIds } }] },
      include: { petA: true, petB: true }
    });
    const partnerPets = matches.map(m => {
      const isPetA = myPetIds.includes(m.petAId);
      return { matchId: m.id, pet: isPetA ? m.petB : m.petA };
    });
    res.json(partnerPets);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Laden der Matches" });
  }
};

exports.updateSpeciesName = async (req, res) => {
  try {
    await prisma.petProfile.updateMany({
      where: { species: req.body.oldName },
      data: { species: req.body.newName }
    });
    res.json({ message: "Erfolgreich geändert" });
  } catch (error) { res.status(500).json({ error: "Fehler" }); }
};

exports.deleteSpeciesName = async (req, res) => {
  try {
    await prisma.petProfile.updateMany({
      where: { species: req.params.name },
      data: { species: 'Sonstiges' }
    });
    res.json({ message: "Erfolgreich entfernt" });
  } catch (error) { res.status(500).json({ error: "Fehler" }); }
};