/*
  Warnings:

  - Added the required column `elective` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "elective" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SubjectToGroup" (
    "subjectId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectToGroup_pkey" PRIMARY KEY ("groupId","subjectId")
);

-- AddForeignKey
ALTER TABLE "SubjectToGroup" ADD CONSTRAINT "SubjectToGroup_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToGroup" ADD CONSTRAINT "SubjectToGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
