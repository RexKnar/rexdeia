/*
  Warnings:

  - A unique constraint covering the columns `[studentId,academicExamId,assessmentFormatId]` on the table `MarkEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MarkEntry_studentId_academicExamId_key";

-- CreateIndex
CREATE UNIQUE INDEX "MarkEntry_studentId_academicExamId_assessmentFormatId_key" ON "MarkEntry"("studentId", "academicExamId", "assessmentFormatId");
