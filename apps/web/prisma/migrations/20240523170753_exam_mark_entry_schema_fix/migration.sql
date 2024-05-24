/*
  Warnings:

  - You are about to drop the column `academicExamsId` on the `Mark` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mark" DROP CONSTRAINT "Mark_academicExamsId_fkey";

-- AlterTable
ALTER TABLE "Mark" DROP COLUMN "academicExamsId";
