/*
  Warnings:

  - You are about to drop the `SubjectType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AcademicExams" DROP CONSTRAINT "AcademicExams_subjectTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectToSubjectType" DROP CONSTRAINT "SubjectToSubjectType_subjectTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectType" DROP CONSTRAINT "SubjectType_branchId_fkey";

-- DropTable
DROP TABLE "SubjectType";

-- CreateTable
CREATE TABLE "subjectType" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "subjectType_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "AcademicExams" ADD CONSTRAINT "AcademicExams_subjectTypeId_fkey" FOREIGN KEY ("subjectTypeId") REFERENCES "subjectType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToSubjectType" ADD CONSTRAINT "SubjectToSubjectType_subjectTypeId_fkey" FOREIGN KEY ("subjectTypeId") REFERENCES "subjectType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectType" ADD CONSTRAINT "subjectType_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
