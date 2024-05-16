-- AlterTable
ALTER TABLE "StudentMapping" ADD COLUMN     "batchId" UUID;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
