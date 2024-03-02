/*
  Warnings:

  - You are about to drop the column `type` on the `Staff` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_sectionId_fkey";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "sectionId" DROP NOT NULL;

-- DropEnum
DROP TYPE "StaffType";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
