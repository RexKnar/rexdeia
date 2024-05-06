/*
  Warnings:

  - The primary key for the `AcademicSubjectForStaff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `_id` was added to the `AcademicSubjectForStaff` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "AcademicSubjectForStaff" DROP CONSTRAINT "AcademicSubjectForStaff_pkey",
ADD COLUMN     "_id" UUID NOT NULL,
ADD CONSTRAINT "AcademicSubjectForStaff_pkey" PRIMARY KEY ("_id");
