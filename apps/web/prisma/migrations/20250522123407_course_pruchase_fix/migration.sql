-- AlterTable
ALTER TABLE "CoursePurchaseRecord" ADD COLUMN     "courseBatchId" UUID;

-- AddForeignKey
ALTER TABLE "CoursePurchaseRecord" ADD CONSTRAINT "CoursePurchaseRecord_courseBatchId_fkey" FOREIGN KEY ("courseBatchId") REFERENCES "CourseBatch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
