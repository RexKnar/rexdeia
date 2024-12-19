-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "blockMarkEntry" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "markEntryCorrectionDate" TIMESTAMP(3),
ADD COLUMN     "markEntryEndDate" TIMESTAMP(3),
ADD COLUMN     "markEntryOpenDate" TIMESTAMP(3);
