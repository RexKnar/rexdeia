/*
  Warnings:

  - Added the required column `branchId` to the `CoursePurchaseRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoursePurchaseRecord" ADD COLUMN     "branchId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "CoursePurchaseRecord" ADD CONSTRAINT "CoursePurchaseRecord_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
