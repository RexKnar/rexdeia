/*
  Warnings:

  - The `enrollmentNumber` column on the `Staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "mediumOfTeachingId" UUID,
ADD COLUMN     "otherSubjectId" UUID,
ADD COLUMN     "primarySubjectId" UUID,
ADD COLUMN     "secondarySubjectId" UUID,
ADD COLUMN     "udiseNumber" TEXT,
DROP COLUMN "enrollmentNumber",
ADD COLUMN     "enrollmentNumber" SERIAL NOT NULL;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_primarySubjectId_fkey" FOREIGN KEY ("primarySubjectId") REFERENCES "SubjectMaster"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_secondarySubjectId_fkey" FOREIGN KEY ("secondarySubjectId") REFERENCES "SubjectMaster"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_otherSubjectId_fkey" FOREIGN KEY ("otherSubjectId") REFERENCES "SubjectMaster"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_mediumOfTeachingId_fkey" FOREIGN KEY ("mediumOfTeachingId") REFERENCES "Medium"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
