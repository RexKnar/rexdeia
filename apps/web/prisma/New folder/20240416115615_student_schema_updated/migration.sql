/*
  Warnings:

  - You are about to drop the column `formId` on the `AdmissionForm` table. All the data in the column will be lost.
  - You are about to drop the column `formId` on the `Student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdmissionForm" DROP CONSTRAINT "AdmissionForm_formId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_formId_fkey";

-- DropForeignKey
ALTER TABLE "StudentMapping" DROP CONSTRAINT "StudentMapping_sectionId_fkey";

-- AlterTable
ALTER TABLE "AdmissionForm" DROP COLUMN "formId";

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "formId",
ALTER COLUMN "middleName" DROP NOT NULL,
ALTER COLUMN "bloodGroup" DROP NOT NULL,
ALTER COLUMN "fatherName" DROP NOT NULL,
ALTER COLUMN "fatherOccupation" DROP NOT NULL,
ALTER COLUMN "guardiansOccupation" DROP NOT NULL,
ALTER COLUMN "guardianName" DROP NOT NULL,
ALTER COLUMN "motherName" DROP NOT NULL,
ALTER COLUMN "motherOccupation" DROP NOT NULL,
ALTER COLUMN "motherTongue" DROP NOT NULL,
ALTER COLUMN "nationality" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StudentMapping" ADD COLUMN     "mediumId" UUID,
ALTER COLUMN "sectionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_mediumId_fkey" FOREIGN KEY ("mediumId") REFERENCES "Medium"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
