/*
  Warnings:

  - You are about to drop the column `convertToPercentage` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `totalMarks` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Exam` table. All the data in the column will be lost.
  - Added the required column `batchId` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examTypeId` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termId` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "convertToPercentage",
DROP COLUMN "totalMarks",
DROP COLUMN "type",
ADD COLUMN     "batchId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "examTypeId" UUID NOT NULL,
ADD COLUMN     "termId" UUID NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ExamType" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamType_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Term" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ExamConfiguration" (
    "minMark" INTEGER NOT NULL,
    "maxMark" INTEGER NOT NULL,
    "markToConduct" INTEGER NOT NULL,
    "dateToConduct" TIMESTAMP(3) NOT NULL,
    "examId" UUID NOT NULL,
    "classId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,

    CONSTRAINT "ExamConfiguration_pkey" PRIMARY KEY ("examId","classId","sectionId","subjectId")
);

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_examTypeId_fkey" FOREIGN KEY ("examTypeId") REFERENCES "ExamType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamConfiguration" ADD CONSTRAINT "ExamConfiguration_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamConfiguration" ADD CONSTRAINT "ExamConfiguration_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamConfiguration" ADD CONSTRAINT "ExamConfiguration_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamConfiguration" ADD CONSTRAINT "ExamConfiguration_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
