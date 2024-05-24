/*
  Warnings:

  - Added the required column `groupId` to the `ExamSubject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamSubject" ADD COLUMN     "groupId" UUID NOT NULL,
ALTER COLUMN "totalMarks" SET DEFAULT 0,
ALTER COLUMN "convertTo" SET DEFAULT 0,
ALTER COLUMN "minMark" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ExamSubjectPartition" ALTER COLUMN "partitionName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
