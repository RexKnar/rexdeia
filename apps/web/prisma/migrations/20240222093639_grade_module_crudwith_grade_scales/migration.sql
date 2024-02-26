-- CreateTable
CREATE TABLE "Grade" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "GradeScales" (
    "_id" UUID NOT NULL,
    "startValue" TEXT NOT NULL,
    "endValue" TEXT NOT NULL,
    "gradeName" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "gradeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GradeScales_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeScales" ADD CONSTRAINT "GradeScales_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
