-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "gradeId" UUID;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
