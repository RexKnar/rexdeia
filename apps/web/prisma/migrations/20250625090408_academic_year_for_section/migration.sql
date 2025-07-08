-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "academicYearId" UUID;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "Batch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
