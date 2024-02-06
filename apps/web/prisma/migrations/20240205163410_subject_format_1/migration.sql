-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_subjectFormatId_fkey";

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "subjectFormatId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_subjectFormatId_fkey" FOREIGN KEY ("subjectFormatId") REFERENCES "SubjectFormat"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
