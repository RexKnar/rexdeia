/*
  Warnings:

  - The `textContent` column on the `InstituteCourseChapterItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "InstituteCourseChapterItem" DROP COLUMN "textContent",
ADD COLUMN     "textContent" JSONB;
