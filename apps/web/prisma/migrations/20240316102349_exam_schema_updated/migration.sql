/*
  Warnings:

  - You are about to drop the column `termId` on the `Exam` table. All the data in the column will be lost.
  - The primary key for the `ExamConfiguration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classId` on the `ExamConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `maxMark` on the `ExamConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `minMark` on the `ExamConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `ExamConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `ExamConfiguration` table. All the data in the column will be lost.
  - The primary key for the `StudentMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `classId` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assessmentFormatId` to the `ExamConfiguration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `markToConvert` to the `ExamConfiguration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minPassMark` to the `ExamConfiguration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `ExamType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termId` to the `ExamType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_termId_fkey";

-- DropForeignKey
ALTER TABLE "ExamConfiguration" DROP CONSTRAINT "ExamConfiguration_classId_fkey";

-- DropForeignKey
ALTER TABLE "ExamConfiguration" DROP CONSTRAINT "ExamConfiguration_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "ExamConfiguration" DROP CONSTRAINT "ExamConfiguration_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "ExamGroup" DROP CONSTRAINT "ExamGroup_exam1Id_fkey";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "termId",
ADD COLUMN     "classId" UUID NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ADD COLUMN     "subjectId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ExamConfiguration" DROP CONSTRAINT "ExamConfiguration_pkey",
DROP COLUMN "classId",
DROP COLUMN "maxMark",
DROP COLUMN "minMark",
DROP COLUMN "sectionId",
DROP COLUMN "subjectId",
ADD COLUMN     "assessmentFormatId" UUID NOT NULL,
ADD COLUMN     "markToConvert" INTEGER NOT NULL,
ADD COLUMN     "minPassMark" INTEGER NOT NULL,
ADD CONSTRAINT "ExamConfiguration_pkey" PRIMARY KEY ("examId", "assessmentFormatId");

-- AlterTable
ALTER TABLE "ExamType" ADD COLUMN     "branchId" UUID NOT NULL,
ADD COLUMN     "termId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "StudentMapping" DROP CONSTRAINT "StudentMapping_pkey",
ADD CONSTRAINT "StudentMapping_pkey" PRIMARY KEY ("studentId", "classId", "sectionId", "groupId");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamType" ADD CONSTRAINT "ExamType_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamType" ADD CONSTRAINT "ExamType_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamConfiguration" ADD CONSTRAINT "ExamConfiguration_assessmentFormatId_fkey" FOREIGN KEY ("assessmentFormatId") REFERENCES "AssessmentFormat"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
