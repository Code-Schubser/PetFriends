const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- PetFriends DB Test ---");
  const user = await prisma.user.create({
    data: {
      email: "dennis@hsbi.de",
      passwordHash: "hash_xyz_123", // Nur ein Test-String
      firstName: "Dennis",
      lastName: "Student",
      role: "PRIVAT"
    }
  });
  console.log("Erfolg! Nutzer angelegt:", user);
}

main()
  .catch(e => console.error("Fehler:", e))
  .finally(async () => await prisma.$disconnect());