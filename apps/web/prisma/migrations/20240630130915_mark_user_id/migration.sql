/*
  Warnings:

  - You are about to drop the column `staffId` on the `Mark` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Mark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'OfficeAdmin';
ALTER TYPE "UserRole" ADD VALUE 'HM';
ALTER TYPE "UserRole" ADD VALUE 'AHM';

-- DropForeignKey
ALTER TABLE "Mark" DROP CONSTRAINT "Mark_staffId_fkey";

-- AlterTable
ALTER TABLE "Mark" DROP COLUMN "staffId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
