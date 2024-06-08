/*
  Warnings:

  - You are about to drop the `AcademicExams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamConfiguration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarkEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MarkEntryToSubject` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[academicYearId,staffId,sectionId,subjectId,deletedAt]` on the table `AcademicSubjectForStaff` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AcademicExams" DROP CONSTRAINT "AcademicExams_classId_fkey";

-- DropForeignKey
ALTER TABLE "AcademicExams" DROP CONSTRAINT "AcademicExams_examId_fkey";

-- DropForeignKey
ALTER TABLE "AcademicExams" DROP CONSTRAINT "AcademicExams_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "AcademicExams" DROP CONSTRAINT "AcademicExams_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "AcademicExams" DROP CONSTRAINT "AcademicExams_subjectTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ExamConfiguration" DROP CONSTRAINT "ExamConfiguration_academicExamId_fkey";

-- DropForeignKey
ALTER TABLE "ExamConfiguration" DROP CONSTRAINT "ExamConfiguration_assessmentFormatId_fkey";

-- DropForeignKey
ALTER TABLE "MarkEntry" DROP CONSTRAINT "MarkEntry_academicExamId_fkey";

-- DropForeignKey
ALTER TABLE "MarkEntry" DROP CONSTRAINT "MarkEntry_assessmentFormatId_fkey";

-- DropForeignKey
ALTER TABLE "MarkEntry" DROP CONSTRAINT "MarkEntry_staffId_fkey";

-- DropForeignKey
ALTER TABLE "MarkEntry" DROP CONSTRAINT "MarkEntry_studentId_fkey";

-- DropForeignKey
ALTER TABLE "_MarkEntryToSubject" DROP CONSTRAINT "_MarkEntryToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_MarkEntryToSubject" DROP CONSTRAINT "_MarkEntryToSubject_B_fkey";

-- DropIndex
DROP INDEX "AcademicSubjectForStaff_academicYearId_staffId_sectionId_su_key";

-- AlterTable
ALTER TABLE "Mark" ADD COLUMN     "SubjectMasterId" UUID;

-- DropTable
DROP TABLE "AcademicExams";

-- DropTable
DROP TABLE "ExamConfiguration";

-- DropTable
DROP TABLE "MarkEntry";

-- DropTable
DROP TABLE "_MarkEntryToSubject";

-- CreateTable
CREATE TABLE "StudentElectiveSubject" (
    "_id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "subjectMasterId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "academicYearId" UUID NOT NULL,
    "deletedAt" TIMESTAMP,

    CONSTRAINT "StudentElectiveSubject_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentElectiveSubject_academicYearId_studentId_subjectId_d_key" ON "StudentElectiveSubject"("academicYearId", "studentId", "subjectId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicSubjectForStaff_academicYearId_staffId_sectionId_su_key" ON "AcademicSubjectForStaff"("academicYearId", "staffId", "sectionId", "subjectId", "deletedAt");

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_SubjectMasterId_fkey" FOREIGN KEY ("SubjectMasterId") REFERENCES "SubjectMaster"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentElectiveSubject" ADD CONSTRAINT "StudentElectiveSubject_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentElectiveSubject" ADD CONSTRAINT "StudentElectiveSubject_subjectMasterId_fkey" FOREIGN KEY ("subjectMasterId") REFERENCES "SubjectMaster"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentElectiveSubject" ADD CONSTRAINT "StudentElectiveSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentElectiveSubject" ADD CONSTRAINT "StudentElectiveSubject_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
