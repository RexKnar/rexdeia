/*
  Warnings:

  - A unique constraint covering the columns `[studentId,academicExamId]` on the table `MarkEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MarkEntry_studentId_academicExamId_key" ON "MarkEntry"("studentId", "academicExamId");
