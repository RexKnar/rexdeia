/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `AcademicSubjectForStaff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AcademicSubjectForStaff" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP;
