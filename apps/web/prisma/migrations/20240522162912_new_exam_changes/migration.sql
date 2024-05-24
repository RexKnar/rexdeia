/*
  Warnings:

  - Added the required column `dateToConduct` to the `ExamSubjectPartition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamSubjectPartition" ADD COLUMN     "dateToConduct" TIMESTAMP(3) NOT NULL;
