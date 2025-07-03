/*
  Warnings:

  - You are about to drop the column `role` on the `UserOrganization` table. All the data in the column will be lost.
  - You are about to drop the `ModelAccess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ModelAccess" DROP CONSTRAINT "ModelAccess_roleId_fkey";

-- AlterTable
ALTER TABLE "UserOrganization" DROP COLUMN "role",
ADD COLUMN     "roleId" UUID;

-- DropTable
DROP TABLE "ModelAccess";

-- CreateTable
CREATE TABLE "ModuleAccess" (
    "_id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "module" TEXT NOT NULL,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ModuleAccess_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
