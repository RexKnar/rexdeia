/*
  Warnings:

  - Added the required column `branchId` to the `Term` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Term" ADD COLUMN     "branchId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
