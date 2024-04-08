/*
  Warnings:

  - You are about to drop the column `attandence` on the `MarkEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MarkEntry" DROP COLUMN "attandence",
ADD COLUMN     "attandance" INTEGER;
