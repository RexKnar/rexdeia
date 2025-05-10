-- AlterTable
ALTER TABLE "InstituteCourse" ADD COLUMN     "courseType" TEXT NOT NULL DEFAULT 'Recorded';

-- CreateTable
CREATE TABLE "CourseBatch" (
    "_id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "totalHours" INTEGER NOT NULL,
    "hoursPerDay" INTEGER NOT NULL,
    "sessionDays" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "branchId" UUID NOT NULL,

    CONSTRAINT "CourseBatch_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "RecordedBatchContent" (
    "_id" UUID NOT NULL,
    "courseItemId" UUID NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "batchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RecordedBatchContent_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "CourseBatch" ADD CONSTRAINT "CourseBatch_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "InstituteCourse"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseBatch" ADD CONSTRAINT "CourseBatch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordedBatchContent" ADD CONSTRAINT "RecordedBatchContent_courseItemId_fkey" FOREIGN KEY ("courseItemId") REFERENCES "InstituteCourseChapterItem"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordedBatchContent" ADD CONSTRAINT "RecordedBatchContent_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "CourseBatch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
