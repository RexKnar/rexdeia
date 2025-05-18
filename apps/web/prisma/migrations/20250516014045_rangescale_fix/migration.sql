-- AlterTable
ALTER TABLE "RangeScales" ADD COLUMN     "classLevelId" UUID;

-- AddForeignKey
ALTER TABLE "RangeScales" ADD CONSTRAINT "RangeScales_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
