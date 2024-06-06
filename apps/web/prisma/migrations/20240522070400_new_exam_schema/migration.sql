/*
  Warnings:

  - You are about to drop the column `convertToPercentage` on the `ExamGroup` table. All the data in the column will be lost.
  - You are about to drop the column `exam1Id` on the `ExamGroup` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ExamGroup` table. All the data in the column will be lost.
  - You are about to drop the column `convertToPercentage` on the `ExamSubject` table. All the data in the column will be lost.
  - You are about to drop the column `convertToPercentage` on the `ExamSubjectPartition` table. All the data in the column will be lost.
  - Added the required column `classId` to the `ExamGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examId` to the `ExamGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionId` to the `ExamGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `convertTo` to the `ExamSubject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minMark` to the `ExamSubject` table without a default value. This is not possible if the table is not empty.
  - Made the column `examGroupId` on table `ExamSubject` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `assessmentFormatId` to the `ExamSubjectPartition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `convertTo` to the `ExamSubjectPartition` table without a default value. This is not possible if the table is not empty.
  - Made the column `examSubjectId` on table `ExamSubjectPartition` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ExamSubject" DROP CONSTRAINT "ExamSubject_examGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ExamSubjectPartition" DROP CONSTRAINT "ExamSubjectPartition_examSubjectId_fkey";

-- AlterTable
ALTER TABLE "ExamGroup" DROP COLUMN "convertToPercentage",
DROP COLUMN "exam1Id",
DROP COLUMN "name",
ADD COLUMN     "classId" UUID NOT NULL,
ADD COLUMN     "examId" UUID NOT NULL,
ADD COLUMN     "sectionId" UUID NOT NULL,
ALTER COLUMN "totalMarks" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ExamSubject" DROP COLUMN "convertToPercentage",
ADD COLUMN     "convertTo" INTEGER NOT NULL,
ADD COLUMN     "minMark" INTEGER NOT NULL,
ALTER COLUMN "examGroupId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ExamSubjectPartition" DROP COLUMN "convertToPercentage",
ADD COLUMN     "assessmentFormatId" UUID NOT NULL,
ADD COLUMN     "convertTo" INTEGER NOT NULL,
ALTER COLUMN "examSubjectId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Mark" (
    "_id" UUID NOT NULL,
    "mark" INTEGER,
    "attandance" INTEGER,
    "studentId" UUID NOT NULL,
    "staffId" UUID NOT NULL,
    "examSubjectId" UUID NOT NULL,
    "examSubjectPartitionId" UUID NOT NULL,
    "academicExamsId" UUID,
    "subjectId" UUID,
    "assessmentFormatId" UUID,

    CONSTRAINT "Mark_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mark_studentId_examSubjectId_examSubjectPartitionId_key" ON "Mark"("studentId", "examSubjectId", "examSubjectPartitionId");

-- AddForeignKey
ALTER TABLE "ExamGroup" ADD CONSTRAINT "ExamGroup_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGroup" ADD CONSTRAINT "ExamGroup_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGroup" ADD CONSTRAINT "ExamGroup_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_examGroupId_fkey" FOREIGN KEY ("examGroupId") REFERENCES "ExamGroup"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubjectPartition" ADD CONSTRAINT "ExamSubjectPartition_examSubjectId_fkey" FOREIGN KEY ("examSubjectId") REFERENCES "ExamSubject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubjectPartition" ADD CONSTRAINT "ExamSubjectPartition_assessmentFormatId_fkey" FOREIGN KEY ("assessmentFormatId") REFERENCES "AssessmentFormat"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_examSubjectId_fkey" FOREIGN KEY ("examSubjectId") REFERENCES "ExamSubject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_examSubjectPartitionId_fkey" FOREIGN KEY ("examSubjectPartitionId") REFERENCES "ExamSubjectPartition"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_academicExamsId_fkey" FOREIGN KEY ("academicExamsId") REFERENCES "AcademicExams"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_assessmentFormatId_fkey" FOREIGN KEY ("assessmentFormatId") REFERENCES "AssessmentFormat"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
