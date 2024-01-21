/*
  Warnings:

  - Added the required column `subjectFormatId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "subjectFormatId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "SubjectFormat" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "branchId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectFormat_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_subjectFormatId_fkey" FOREIGN KEY ("subjectFormatId") REFERENCES "SubjectFormat"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectFormat" ADD CONSTRAINT "SubjectFormat_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
