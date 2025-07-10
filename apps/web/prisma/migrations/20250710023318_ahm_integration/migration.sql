-- AlterTable
ALTER TABLE "ClassLevel" ADD COLUMN     "staffId" UUID;

-- CreateTable
CREATE TABLE "ClassLevelIncharge" (
    "_id" UUID NOT NULL,
    "staffId" UUID NOT NULL,
    "classLevelId" UUID NOT NULL,
    "academicYearId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "branchId" UUID NOT NULL,

    CONSTRAINT "ClassLevelIncharge_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "ClassLevel" ADD CONSTRAINT "ClassLevel_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLevelIncharge" ADD CONSTRAINT "ClassLevelIncharge_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLevelIncharge" ADD CONSTRAINT "ClassLevelIncharge_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLevelIncharge" ADD CONSTRAINT "ClassLevelIncharge_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLevelIncharge" ADD CONSTRAINT "ClassLevelIncharge_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLevelIncharge" ADD CONSTRAINT "ClassLevelIncharge_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
