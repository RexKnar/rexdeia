-- AlterTable
ALTER TABLE "UserOrganization" ADD COLUMN     "role" UUID;

-- CreateTable
CREATE TABLE "Role" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" UUID NOT NULL,
    "branchId" UUID,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ModelAccess" (
    "_id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "module" TEXT NOT NULL,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ModelAccess_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelAccess" ADD CONSTRAINT "ModelAccess_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
