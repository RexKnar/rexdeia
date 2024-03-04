/*
  Warnings:

  - You are about to drop the column `type` on the `Staff` table. All the data in the column will be lost.
  - The primary key for the `StudentMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `sectionId` to the `StudentMapping` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_sectionId_fkey";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "sectionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StudentMapping" DROP CONSTRAINT "StudentMapping_pkey",
ADD COLUMN     "sectionId" UUID NOT NULL,
ADD CONSTRAINT "StudentMapping_pkey" PRIMARY KEY ("studentId", "sectionId", "groupId");

-- DropEnum
DROP TYPE "StaffType";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
