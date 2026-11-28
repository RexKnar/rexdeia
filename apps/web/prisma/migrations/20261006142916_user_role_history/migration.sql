-- CreateTable
CREATE TABLE "UserRoleHistory" (
    "_id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "academicYearId" UUID,
    "organizationId" UUID NOT NULL,
    "branchId" UUID,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "assignedById" UUID,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRoleHistory_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE INDEX "UserRoleHistory_userId_academicYearId_idx" ON "UserRoleHistory"("userId", "academicYearId");

-- CreateIndex
CREATE INDEX "UserRoleHistory_branchId_academicYearId_idx" ON "UserRoleHistory"("branchId", "academicYearId");

-- AddForeignKey
ALTER TABLE "UserRoleHistory" ADD CONSTRAINT "UserRoleHistory_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "Batch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleHistory" ADD CONSTRAINT "UserRoleHistory_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleHistory" ADD CONSTRAINT "UserRoleHistory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleHistory" ADD CONSTRAINT "UserRoleHistory_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleHistory" ADD CONSTRAINT "UserRoleHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
