/*
  Warnings:

  - Added the required column `staffId` to the `MarkEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarkEntry" ADD COLUMN     "staffId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "MarkEntry" ADD CONSTRAINT "MarkEntry_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
