/*
  Warnings:

  - Added the required column `chapterId` to the `InstituteCourseChapterItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstituteCourseChapterItem" ADD COLUMN     "chapterId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "InstituteCourseChapterItem" ADD CONSTRAINT "InstituteCourseChapterItem_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "InstituteCourseChapter"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourseChapterItem" ADD CONSTRAINT "InstituteCourseChapterItem_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
