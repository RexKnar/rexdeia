/*
  Warnings:

  - The primary key for the `AcademicSubjectForStaff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `ClassInCharge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AcademicSubjectForStaff" DROP CONSTRAINT "AcademicSubjectForStaff_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "ClassInCharge" DROP CONSTRAINT "ClassInCharge_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "ClassInCharge" DROP CONSTRAINT "ClassInCharge_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "ClassInCharge" DROP CONSTRAINT "ClassInCharge_staffId_fkey";

-- AlterTable
ALTER TABLE "AcademicSubjectForStaff" DROP CONSTRAINT "AcademicSubjectForStaff_pkey",
ADD COLUMN     "isIncharge" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "subjectId" DROP NOT NULL,
ADD CONSTRAINT "AcademicSubjectForStaff_pkey" PRIMARY KEY ("academicYearId", "staffId", "sectionId");

-- DropTable
DROP TABLE "ClassInCharge";

-- AddForeignKey
ALTER TABLE "AcademicSubjectForStaff" ADD CONSTRAINT "AcademicSubjectForStaff_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
