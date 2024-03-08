/*
  Warnings:

  - You are about to drop the column `subjectFormatId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `hasMarkEntry` on the `subjectType` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `subjectType` table. All the data in the column will be lost.
  - You are about to drop the `SubjectFormat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectToSubjectFormat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_subjectFormatId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectFormat" DROP CONSTRAINT "SubjectFormat_branchId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectToSubjectFormat" DROP CONSTRAINT "SubjectToSubjectFormat_subjectFormatId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectToSubjectFormat" DROP CONSTRAINT "SubjectToSubjectFormat_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "subjectType" DROP CONSTRAINT "subjectType_parentId_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "subjectFormatId";

-- AlterTable
ALTER TABLE "subjectType" DROP COLUMN "hasMarkEntry",
DROP COLUMN "parentId";

-- DropTable
DROP TABLE "SubjectFormat";

-- DropTable
DROP TABLE "SubjectToSubjectFormat";

-- CreateTable
CREATE TABLE "AssessmentFormat" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "hasMarkEntry" BOOLEAN,
    "parentId" UUID,
    "branchId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentFormat_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "SubjectToAssessmentFormat" (
    "assessmentFormatId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectToAssessmentFormat_pkey" PRIMARY KEY ("assessmentFormatId","subjectId")
);

-- AddForeignKey
ALTER TABLE "AssessmentFormat" ADD CONSTRAINT "AssessmentFormat_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "AssessmentFormat"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentFormat" ADD CONSTRAINT "AssessmentFormat_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToAssessmentFormat" ADD CONSTRAINT "SubjectToAssessmentFormat_assessmentFormatId_fkey" FOREIGN KEY ("assessmentFormatId") REFERENCES "AssessmentFormat"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToAssessmentFormat" ADD CONSTRAINT "SubjectToAssessmentFormat_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
