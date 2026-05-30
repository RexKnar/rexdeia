-- CreateTable
CREATE TABLE "TimetableDayOff" (
    "_id" UUID NOT NULL,
    "academicYearId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "dayId" UUID NOT NULL,
    "branchId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimetableDayOff_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimetableDayOff_academicYearId_sectionId_dayId_key" ON "TimetableDayOff"("academicYearId", "sectionId", "dayId");

-- AddForeignKey
ALTER TABLE "TimetableDayOff" ADD CONSTRAINT "TimetableDayOff_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableDayOff" ADD CONSTRAINT "TimetableDayOff_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableDayOff" ADD CONSTRAINT "TimetableDayOff_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Days"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableDayOff" ADD CONSTRAINT "TimetableDayOff_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableDayOff" ADD CONSTRAINT "TimetableDayOff_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

