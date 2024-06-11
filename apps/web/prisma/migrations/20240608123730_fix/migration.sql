-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_motherTongueId_fkey";

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "motherTongueId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_motherTongueId_fkey" FOREIGN KEY ("motherTongueId") REFERENCES "Language"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
