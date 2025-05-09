/*
  Warnings:

  - You are about to drop the column `isEnriched` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `SharedFile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "File_userId_isEnriched_idx";

-- DropIndex
DROP INDEX "SharedFile_expiresAt_idx";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "isEnriched";

-- AlterTable
ALTER TABLE "SharedFile" DROP COLUMN "expiresAt",
ADD COLUMN     "expiresOn" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sharedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "SharedFile_expiresOn_idx" ON "SharedFile"("expiresOn");
