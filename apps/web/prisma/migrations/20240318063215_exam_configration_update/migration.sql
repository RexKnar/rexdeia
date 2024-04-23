/*
  Warnings:

  - The primary key for the `ExamConfiguration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `_id` was added to the `ExamConfiguration` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "ExamConfiguration" DROP CONSTRAINT "ExamConfiguration_assessmentFormatId_fkey";

-- AlterTable
ALTER TABLE "ExamConfiguration" DROP CONSTRAINT "ExamConfiguration_pkey",
ADD COLUMN     "_id" UUID NOT NULL,
ALTER COLUMN "assessmentFormatId" DROP NOT NULL,
ADD CONSTRAINT "ExamConfiguration_pkey" PRIMARY KEY ("_id");

-- AddForeignKey
ALTER TABLE "ExamConfiguration" ADD CONSTRAINT "ExamConfiguration_assessmentFormatId_fkey" FOREIGN KEY ("assessmentFormatId") REFERENCES "AssessmentFormat"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
