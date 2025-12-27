-- DropForeignKey
ALTER TABLE "PetProfile" DROP CONSTRAINT "PetProfile_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "PetProfile" ADD CONSTRAINT "PetProfile_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
