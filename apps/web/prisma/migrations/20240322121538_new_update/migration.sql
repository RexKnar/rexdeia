/*
  Warnings:

  - You are about to drop the `subjectType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subjectTypeId` to the `AcademicExams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubjectToSubjectType" DROP CONSTRAINT "SubjectToSubjectType_subjectTypeId_fkey";

-- DropForeignKey
ALTER TABLE "subjectType" DROP CONSTRAINT "subjectType_branchId_fkey";

-- AlterTable
ALTER TABLE "AcademicExams" ADD COLUMN     "subjectTypeId" UUID NOT NULL;

-- DropTable
DROP TABLE "subjectType";

-- CreateTable
CREATE TABLE "SubjectType" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SubjectType_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "AcademicExams" ADD CONSTRAINT "AcademicExams_subjectTypeId_fkey" FOREIGN KEY ("subjectTypeId") REFERENCES "SubjectType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToSubjectType" ADD CONSTRAINT "SubjectToSubjectType_subjectTypeId_fkey" FOREIGN KEY ("subjectTypeId") REFERENCES "SubjectType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectType" ADD CONSTRAINT "SubjectType_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
