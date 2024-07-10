/*
  Warnings:

  - You are about to drop the column `examId` on the `ExamConfiguration` table. All the data in the column will be lost.
  - Added the required column `academicExamId` to the `ExamConfiguration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExamConfiguration" DROP CONSTRAINT "ExamConfiguration_examId_fkey";

-- AlterTable
ALTER TABLE "ExamConfiguration" DROP COLUMN "examId",
ADD COLUMN     "academicExamId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamConfiguration" ADD CONSTRAINT "ExamConfiguration_academicExamId_fkey" FOREIGN KEY ("academicExamId") REFERENCES "AcademicExams"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
