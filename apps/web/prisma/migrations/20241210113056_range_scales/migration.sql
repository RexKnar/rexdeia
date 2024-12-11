-- CreateEnum
CREATE TYPE "RangeType" AS ENUM ('SubjectMarks', 'TotalMarks');

-- CreateTable
CREATE TABLE "RangeScales" (
    "_id" UUID NOT NULL,
    "startValue" TEXT NOT NULL,
    "endValue" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "batchId" UUID NOT NULL,
    "rangeOf" "RangeType" NOT NULL DEFAULT 'SubjectMarks',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RangeScales_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "RangeScales" ADD CONSTRAINT "RangeScales_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
