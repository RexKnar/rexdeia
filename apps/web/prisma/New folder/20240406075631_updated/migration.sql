/*
  Warnings:

  - You are about to drop the column `absent` on the `MarkEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MarkEntry" DROP COLUMN "absent",
ADD COLUMN     "attandence" INTEGER;
