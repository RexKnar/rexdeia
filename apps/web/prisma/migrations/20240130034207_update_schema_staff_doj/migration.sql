/*
  Warnings:

  - The `dateOfJoining` column on the `Staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "dateOfJoining",
ADD COLUMN     "dateOfJoining" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
