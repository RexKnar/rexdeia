/*
  Warnings:

  - You are about to drop the column `batchId` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `termId` on the `ExamType` table. All the data in the column will be lost.
  - Added the required column `termId` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_batchId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_classId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "ExamConfiguration" DROP CONSTRAINT "ExamConfiguration_examId_fkey";

-- DropForeignKey
ALTER TABLE "ExamType" DROP CONSTRAINT "ExamType_termId_fkey";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "batchId",
DROP COLUMN "classId",
DROP COLUMN "sectionId",
DROP COLUMN "subjectId",
ADD COLUMN     "termId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ExamType" DROP COLUMN "termId";

-- CreateTable
CREATE TABLE "AcademicExams" (
    "_id" UUID NOT NULL,
    "batchId" UUID NOT NULL,
    "examId" UUID NOT NULL,
    "sectionId" UUID,
    "classId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AcademicExams_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicExams" ADD CONSTRAINT "AcademicExams_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicExams" ADD CONSTRAINT "AcademicExams_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicExams" ADD CONSTRAINT "AcademicExams_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicExams" ADD CONSTRAINT "AcademicExams_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicExams" ADD CONSTRAINT "AcademicExams_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamConfiguration" ADD CONSTRAINT "ExamConfiguration_examId_fkey" FOREIGN KEY ("examId") REFERENCES "AcademicExams"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
