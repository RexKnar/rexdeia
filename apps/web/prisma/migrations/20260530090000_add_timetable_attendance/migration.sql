-- CreateEnum
CREATE TYPE "SlotKind" AS ENUM ('Period', 'Interval');

-- CreateEnum
CREATE TYPE "IntervalType" AS ENUM ('Lunch', 'RefreshmentBreak', 'Other');

-- CreateEnum
CREATE TYPE "DaySession" AS ENUM ('Morning', 'Afternoon');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('Present', 'Absent', 'Leave');

-- CreateEnum
CREATE TYPE "StudentAttendanceLevel" AS ENUM ('Period', 'Daily');

-- CreateTable
CREATE TABLE "TimetableStructure" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "classLevelId" UUID NOT NULL,
    "branchId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "dayStartTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimetableStructure_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "TimetableSlot" (
    "_id" UUID NOT NULL,
    "structureId" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "kind" "SlotKind" NOT NULL,
    "label" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "durationMins" INTEGER NOT NULL,
    "session" "DaySession" NOT NULL,
    "periodTypeId" UUID,
    "intervalType" "IntervalType",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimetableSlot_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "TimetableEntry" (
    "_id" UUID NOT NULL,
    "academicYearId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "dayId" UUID NOT NULL,
    "slotId" UUID NOT NULL,
    "subjectId" UUID,
    "staffId" UUID,
    "branchId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimetableEntry_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "TimetableSubstitution" (
    "_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "entryId" UUID NOT NULL,
    "originalStaffId" UUID,
    "substituteStaffId" UUID NOT NULL,
    "reason" TEXT,
    "branchId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimetableSubstitution_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "StaffAttendance" (
    "_id" UUID NOT NULL,
    "staffId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "remark" TEXT,
    "branchId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffAttendance_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "StudentAttendance" (
    "_id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "academicYearId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "level" "StudentAttendanceLevel" NOT NULL,
    "slotId" UUID,
    "session" "DaySession",
    "status" "AttendanceStatus" NOT NULL,
    "markedByStaffId" UUID,
    "remark" TEXT,
    "branchId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAttendance_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE INDEX "TimetableStructure_classLevelId_branchId_idx" ON "TimetableStructure"("classLevelId", "branchId");

-- CreateIndex
CREATE INDEX "TimetableSlot_structureId_order_idx" ON "TimetableSlot"("structureId", "order");

-- CreateIndex
CREATE INDEX "TimetableEntry_academicYearId_sectionId_idx" ON "TimetableEntry"("academicYearId", "sectionId");

-- CreateIndex
CREATE INDEX "TimetableEntry_staffId_idx" ON "TimetableEntry"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "TimetableEntry_academicYearId_sectionId_dayId_slotId_key" ON "TimetableEntry"("academicYearId", "sectionId", "dayId", "slotId");

-- CreateIndex
CREATE INDEX "TimetableSubstitution_date_idx" ON "TimetableSubstitution"("date");

-- CreateIndex
CREATE UNIQUE INDEX "TimetableSubstitution_entryId_date_key" ON "TimetableSubstitution"("entryId", "date");

-- CreateIndex
CREATE INDEX "StaffAttendance_date_idx" ON "StaffAttendance"("date");

-- CreateIndex
CREATE UNIQUE INDEX "StaffAttendance_staffId_date_key" ON "StaffAttendance"("staffId", "date");

-- CreateIndex
CREATE INDEX "StudentAttendance_sectionId_date_idx" ON "StudentAttendance"("sectionId", "date");

-- CreateIndex
CREATE INDEX "StudentAttendance_studentId_date_idx" ON "StudentAttendance"("studentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttendance_studentId_date_slotId_key" ON "StudentAttendance"("studentId", "date", "slotId");

-- AddForeignKey
ALTER TABLE "TimetableStructure" ADD CONSTRAINT "TimetableStructure_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableStructure" ADD CONSTRAINT "TimetableStructure_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableStructure" ADD CONSTRAINT "TimetableStructure_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSlot" ADD CONSTRAINT "TimetableSlot_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "TimetableStructure"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSlot" ADD CONSTRAINT "TimetableSlot_periodTypeId_fkey" FOREIGN KEY ("periodTypeId") REFERENCES "PeriodType"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableEntry" ADD CONSTRAINT "TimetableEntry_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableEntry" ADD CONSTRAINT "TimetableEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableEntry" ADD CONSTRAINT "TimetableEntry_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Days"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableEntry" ADD CONSTRAINT "TimetableEntry_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "TimetableSlot"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableEntry" ADD CONSTRAINT "TimetableEntry_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableEntry" ADD CONSTRAINT "TimetableEntry_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableEntry" ADD CONSTRAINT "TimetableEntry_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableEntry" ADD CONSTRAINT "TimetableEntry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSubstitution" ADD CONSTRAINT "TimetableSubstitution_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "TimetableEntry"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSubstitution" ADD CONSTRAINT "TimetableSubstitution_originalStaffId_fkey" FOREIGN KEY ("originalStaffId") REFERENCES "Staff"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSubstitution" ADD CONSTRAINT "TimetableSubstitution_substituteStaffId_fkey" FOREIGN KEY ("substituteStaffId") REFERENCES "Staff"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSubstitution" ADD CONSTRAINT "TimetableSubstitution_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSubstitution" ADD CONSTRAINT "TimetableSubstitution_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAttendance" ADD CONSTRAINT "StaffAttendance_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAttendance" ADD CONSTRAINT "StaffAttendance_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAttendance" ADD CONSTRAINT "StaffAttendance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "TimetableSlot"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_markedByStaffId_fkey" FOREIGN KEY ("markedByStaffId") REFERENCES "Staff"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

