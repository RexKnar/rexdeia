/*
  Warnings:

  - You are about to drop the column `periodsId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `periodMasterId` on the `Days` table. All the data in the column will be lost.
  - You are about to drop the column `periodsId` on the `PeriodMaster` table. All the data in the column will be lost.
  - You are about to drop the column `periodDuration` on the `PeriodType` table. All the data in the column will be lost.
  - You are about to drop the column `periodMasterId` on the `PeriodType` table. All the data in the column will be lost.
  - You are about to drop the column `periodMode` on the `PeriodType` table. All the data in the column will be lost.
  - You are about to drop the column `periodsId` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `periodsId` on the `Staff` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_periodsId_fkey";

-- DropForeignKey
ALTER TABLE "Days" DROP CONSTRAINT "Days_periodMasterId_fkey";

-- DropForeignKey
ALTER TABLE "PeriodMaster" DROP CONSTRAINT "PeriodMaster_periodsId_fkey";

-- DropForeignKey
ALTER TABLE "PeriodType" DROP CONSTRAINT "PeriodType_periodMasterId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_periodsId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_periodsId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "periodsId";

-- AlterTable
ALTER TABLE "Days" DROP COLUMN "periodMasterId";

-- AlterTable
ALTER TABLE "PeriodMaster" DROP COLUMN "periodsId",
ADD COLUMN     "daysId" UUID,
ADD COLUMN     "periodModeId" UUID,
ADD COLUMN     "periodTypeId" UUID;

-- AlterTable
ALTER TABLE "PeriodType" DROP COLUMN "periodDuration",
DROP COLUMN "periodMasterId",
DROP COLUMN "periodMode";

-- AlterTable
ALTER TABLE "Periods" ADD COLUMN     "batchId" UUID,
ADD COLUMN     "classId" UUID,
ADD COLUMN     "organizationId" UUID,
ADD COLUMN     "periodMasterId" UUID,
ADD COLUMN     "sectionId" UUID,
ADD COLUMN     "staffId" UUID;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "periodsId";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "periodsId";

-- CreateTable
CREATE TABLE "PeriodMode" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PeriodMode_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "PeriodMaster" ADD CONSTRAINT "PeriodMaster_periodTypeId_fkey" FOREIGN KEY ("periodTypeId") REFERENCES "PeriodType"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodMaster" ADD CONSTRAINT "PeriodMaster_daysId_fkey" FOREIGN KEY ("daysId") REFERENCES "Days"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodMaster" ADD CONSTRAINT "PeriodMaster_periodModeId_fkey" FOREIGN KEY ("periodModeId") REFERENCES "PeriodMode"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periods" ADD CONSTRAINT "Periods_periodMasterId_fkey" FOREIGN KEY ("periodMasterId") REFERENCES "PeriodMaster"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periods" ADD CONSTRAINT "Periods_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periods" ADD CONSTRAINT "Periods_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periods" ADD CONSTRAINT "Periods_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periods" ADD CONSTRAINT "Periods_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periods" ADD CONSTRAINT "Periods_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
