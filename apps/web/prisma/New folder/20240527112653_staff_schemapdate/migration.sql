/*
  Warnings:

  - Made the column `lastName` on table `Staff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mobile` on table `Staff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "firstName" SET DEFAULT '',
ALTER COLUMN "middleName" SET DEFAULT '',
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "lastName" SET DEFAULT '',
ALTER COLUMN "dateOfBirth" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "gender" SET DEFAULT '',
ALTER COLUMN "mobile" SET NOT NULL,
ALTER COLUMN "mobile" SET DEFAULT '',
ALTER COLUMN "email" SET DEFAULT '';
