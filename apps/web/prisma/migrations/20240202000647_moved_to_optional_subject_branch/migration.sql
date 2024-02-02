-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_branchId_fkey";

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "branchId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
