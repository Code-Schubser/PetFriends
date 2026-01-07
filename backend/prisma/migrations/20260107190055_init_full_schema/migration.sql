/*
  Warnings:

  - You are about to alter the column `name` on the `PetProfile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `species` on the `PetProfile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `breed` on the `PetProfile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "PetProfile" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "species" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "breed" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "birthdate" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "sourcePetId" INTEGER NOT NULL,
    "targetPetId" INTEGER NOT NULL,
    "isLiked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "petAId" INTEGER NOT NULL,
    "petBId" INTEGER NOT NULL,
    "matchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "url" VARCHAR(512) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_sourcePetId_fkey" FOREIGN KEY ("sourcePetId") REFERENCES "PetProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_targetPetId_fkey" FOREIGN KEY ("targetPetId") REFERENCES "PetProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_petAId_fkey" FOREIGN KEY ("petAId") REFERENCES "PetProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_petBId_fkey" FOREIGN KEY ("petBId") REFERENCES "PetProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_petId_fkey" FOREIGN KEY ("petId") REFERENCES "PetProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
