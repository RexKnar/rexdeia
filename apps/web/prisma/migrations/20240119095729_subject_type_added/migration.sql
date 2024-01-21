/*
  Warnings:

  - Added the required column `subjectTypeId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "subjectTypeId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "SubjectType" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "branchId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectType_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_subjectTypeId_fkey" FOREIGN KEY ("subjectTypeId") REFERENCES "SubjectType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectType" ADD CONSTRAINT "SubjectType_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
