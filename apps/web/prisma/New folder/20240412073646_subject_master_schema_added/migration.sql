/*
  Warnings:

  - Added the required column `subjectMasterId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "subjectMasterId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "SubjectMaster" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "branchId" UUID,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectMaster_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "SubjectMaster" ADD CONSTRAINT "SubjectMaster_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_subjectMasterId_fkey" FOREIGN KEY ("subjectMasterId") REFERENCES "SubjectMaster"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
