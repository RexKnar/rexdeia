/*
  Warnings:

  - Made the column `motherTongueId` on table `Staff` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_motherTongueId_fkey";

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "motherTongueId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_motherTongueId_fkey" FOREIGN KEY ("motherTongueId") REFERENCES "Language"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
