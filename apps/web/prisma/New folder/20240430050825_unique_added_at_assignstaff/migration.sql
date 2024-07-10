/*
  Warnings:

  - A unique constraint covering the columns `[academicYearId,staffId,sectionId,subjectId]` on the table `AcademicSubjectForStaff` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AcademicSubjectForStaff_academicYearId_staffId_sectionId_su_key" ON "AcademicSubjectForStaff"("academicYearId", "staffId", "sectionId", "subjectId");
