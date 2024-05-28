/*
  Warnings:

  - Added the required column `examGroupId` to the `ExamSubjectPartition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamSubjectPartition" ADD COLUMN     "examGroupId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamSubjectPartition" ADD CONSTRAINT "ExamSubjectPartition_examGroupId_fkey" FOREIGN KEY ("examGroupId") REFERENCES "ExamGroup"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
