/*
  Warnings:

  - You are about to drop the column `caste` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `employmentType` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `motherTongue` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `natureOfPosting` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `motherTongue` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "caste",
DROP COLUMN "category",
DROP COLUMN "designation",
DROP COLUMN "employmentType",
DROP COLUMN "motherTongue",
DROP COLUMN "natureOfPosting",
ADD COLUMN     "communityId" UUID,
ADD COLUMN     "designationId" UUID,
ADD COLUMN     "employmentTypeId" UUID,
ADD COLUMN     "motherTongueId" UUID,
ADD COLUMN     "natureOfPostingId" UUID,
ADD COLUMN     "staffCategoryId" UUID;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "motherTongue",
ADD COLUMN     "communityId" UUID,
ADD COLUMN     "motherTongueId" UUID;

-- CreateTable
CREATE TABLE "Community" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Language" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "StaffCategory" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StaffCategory_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "EmploymentType" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EmploymentType_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Designation" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Designation_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "NatureOfPosting" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" UUID NOT NULL,

    CONSTRAINT "NatureOfPosting_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_motherTongueId_fkey" FOREIGN KEY ("motherTongueId") REFERENCES "Language"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_motherTongueId_fkey" FOREIGN KEY ("motherTongueId") REFERENCES "Language"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_natureOfPostingId_fkey" FOREIGN KEY ("natureOfPostingId") REFERENCES "NatureOfPosting"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_employmentTypeId_fkey" FOREIGN KEY ("employmentTypeId") REFERENCES "EmploymentType"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_staffCategoryId_fkey" FOREIGN KEY ("staffCategoryId") REFERENCES "StaffCategory"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NatureOfPosting" ADD CONSTRAINT "NatureOfPosting_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
