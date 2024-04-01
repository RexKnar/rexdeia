/*
  Warnings:

  - You are about to drop the column `batchId` on the `AcademicExams` table. All the data in the column will be lost.
  - Added the required column `batchId` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AcademicExams" DROP CONSTRAINT "AcademicExams_batchId_fkey";

-- AlterTable
ALTER TABLE "AcademicExams" DROP COLUMN "batchId";

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "batchId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
