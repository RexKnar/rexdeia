/*
  Warnings:

  - You are about to drop the column `subjectTypeId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectToCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_branchId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_subjectTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectToCategory" DROP CONSTRAINT "SubjectToCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectToCategory" DROP CONSTRAINT "SubjectToCategory_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectType" DROP CONSTRAINT "SubjectType_branchId_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "subjectTypeId";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "SubjectToCategory";

-- DropTable
DROP TABLE "SubjectType";

-- CreateTable
CREATE TABLE "SubjectToSubjectType" (
    "subjectId" UUID NOT NULL,
    "subjectTypeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectToSubjectType_pkey" PRIMARY KEY ("subjectTypeId","subjectId")
);

-- CreateTable
CREATE TABLE "subjectType" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" UUID,
    "hasMarkEntry" BOOLEAN,
    "isActive" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "subjectType_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "SubjectToSubjectType" ADD CONSTRAINT "SubjectToSubjectType_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToSubjectType" ADD CONSTRAINT "SubjectToSubjectType_subjectTypeId_fkey" FOREIGN KEY ("subjectTypeId") REFERENCES "subjectType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectType" ADD CONSTRAINT "subjectType_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "subjectType"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectType" ADD CONSTRAINT "subjectType_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
