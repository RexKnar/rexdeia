/*
  Warnings:

  - Added the required column `classId` to the `SubjectToGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectToGroup" ADD COLUMN     "classId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "SubjectToGroup" ADD CONSTRAINT "SubjectToGroup_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
