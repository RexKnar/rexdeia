-- AlterTable
ALTER TABLE "PeriodMaster" ADD COLUMN     "levelConfigId" UUID;

-- AddForeignKey
ALTER TABLE "PeriodMaster" ADD CONSTRAINT "PeriodMaster_levelConfigId_fkey" FOREIGN KEY ("levelConfigId") REFERENCES "LevelConfig"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
