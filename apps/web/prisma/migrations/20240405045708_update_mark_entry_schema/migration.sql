/*
  Warnings:

  - Made the column `assessmentFormatId` on table `MarkEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MarkEntry" DROP CONSTRAINT "MarkEntry_assessmentFormatId_fkey";

-- AlterTable
ALTER TABLE "MarkEntry" ALTER COLUMN "mark" DROP NOT NULL,
ALTER COLUMN "absent" DROP NOT NULL,
ALTER COLUMN "assessmentFormatId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MarkEntry" ADD CONSTRAINT "MarkEntry_assessmentFormatId_fkey" FOREIGN KEY ("assessmentFormatId") REFERENCES "AssessmentFormat"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
