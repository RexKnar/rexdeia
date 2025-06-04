-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "currentBatchId" UUID;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_currentBatchId_fkey" FOREIGN KEY ("currentBatchId") REFERENCES "Batch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
