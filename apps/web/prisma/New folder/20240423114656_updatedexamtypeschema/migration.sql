/*
  Warnings:

  - Added the required column `frequencyId` to the `ExamType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamType" ADD COLUMN     "frequencyId" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
