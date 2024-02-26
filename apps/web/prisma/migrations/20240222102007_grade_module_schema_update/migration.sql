-- DropForeignKey
ALTER TABLE "GradeScales" DROP CONSTRAINT "GradeScales_gradeId_fkey";

-- AlterTable
ALTER TABLE "GradeScales" ALTER COLUMN "gradeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GradeScales" ADD CONSTRAINT "GradeScales_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
