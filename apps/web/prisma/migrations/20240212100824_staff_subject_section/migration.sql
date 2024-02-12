/*
  Warnings:

  - You are about to drop the column `sectionId` on the `Staff` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_sectionId_fkey";

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "staffId" UUID;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "sectionId",
ADD COLUMN     "sectionIds" UUID[];

-- CreateTable
CREATE TABLE "StaffSection" (
    "sectionId" UUID NOT NULL,
    "staffId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffSection_pkey" PRIMARY KEY ("sectionId","staffId")
);

-- AddForeignKey
ALTER TABLE "StaffSection" ADD CONSTRAINT "StaffSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffSection" ADD CONSTRAINT "StaffSection_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
