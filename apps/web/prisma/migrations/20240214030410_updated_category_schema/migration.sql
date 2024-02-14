/*
  Warnings:

  - You are about to drop the column `parent` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parent_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "parent",
ADD COLUMN     "parentId" UUID;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
