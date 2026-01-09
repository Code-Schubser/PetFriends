const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Nachricht senden
exports.sendMessage = async (req, res) => {
  const { matchId, senderId, content } = req.body;
  try {
    const message = await prisma.message.create({
      data: {
        matchId: parseInt(matchId),
        senderId: parseInt(senderId),
        content
      }
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Nachricht konnte nicht gesendet werden" });
  }
};

// Chat-Verlauf laden
exports.getMessages = async (req, res) => {
  const { matchId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { matchId: parseInt(matchId) },
      orderBy: { sentAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Laden der Nachrichten" });
  }
};