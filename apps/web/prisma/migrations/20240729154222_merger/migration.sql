-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "periodsId" UUID;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "periodsId" UUID;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "periodsId" UUID;

-- CreateTable
CREATE TABLE "ClassLevel" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "classId" UUID,

    CONSTRAINT "ClassLevel_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "LevelConfig" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "noOfSubjects" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "noOfPeriods" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "classLevelId" UUID,

    CONSTRAINT "LevelConfig_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Days" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "periodMasterId" UUID,

    CONSTRAINT "Days_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "PeriodType" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "periodMode" TEXT NOT NULL,
    "periodDuration" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "periodMasterId" UUID,

    CONSTRAINT "PeriodType_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "PeriodMaster" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "periodsId" UUID NOT NULL,
    "classLevelId" UUID,

    CONSTRAINT "PeriodMaster_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Periods" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "subjectId" UUID,

    CONSTRAINT "Periods_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE INDEX "Student_firstName_lastName_emisNumber_phoneNumber_emailId_a_idx" ON "Student"("firstName", "lastName", "emisNumber", "phoneNumber", "emailId", "aadharCardNumber");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_periodsId_fkey" FOREIGN KEY ("periodsId") REFERENCES "Periods"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_periodsId_fkey" FOREIGN KEY ("periodsId") REFERENCES "Periods"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_periodsId_fkey" FOREIGN KEY ("periodsId") REFERENCES "Periods"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLevel" ADD CONSTRAINT "ClassLevel_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelConfig" ADD CONSTRAINT "LevelConfig_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Days" ADD CONSTRAINT "Days_periodMasterId_fkey" FOREIGN KEY ("periodMasterId") REFERENCES "PeriodMaster"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodType" ADD CONSTRAINT "PeriodType_periodMasterId_fkey" FOREIGN KEY ("periodMasterId") REFERENCES "PeriodMaster"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodMaster" ADD CONSTRAINT "PeriodMaster_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodMaster" ADD CONSTRAINT "PeriodMaster_periodsId_fkey" FOREIGN KEY ("periodsId") REFERENCES "Periods"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periods" ADD CONSTRAINT "Periods_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
