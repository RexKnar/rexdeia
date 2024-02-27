-- CreateTable
CREATE TABLE "AcademicSubjectForStaff" (
    "staffId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "academicYearId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,

    CONSTRAINT "AcademicSubjectForStaff_pkey" PRIMARY KEY ("academicYearId","staffId","sectionId","subjectId")
);

-- CreateTable
CREATE TABLE "ClassInCharge" (
    "staffId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "academicYearId" UUID NOT NULL,

    CONSTRAINT "ClassInCharge_pkey" PRIMARY KEY ("staffId","sectionId","academicYearId")
);

-- AddForeignKey
ALTER TABLE "AcademicSubjectForStaff" ADD CONSTRAINT "AcademicSubjectForStaff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicSubjectForStaff" ADD CONSTRAINT "AcademicSubjectForStaff_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicSubjectForStaff" ADD CONSTRAINT "AcademicSubjectForStaff_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicSubjectForStaff" ADD CONSTRAINT "AcademicSubjectForStaff_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassInCharge" ADD CONSTRAINT "ClassInCharge_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassInCharge" ADD CONSTRAINT "ClassInCharge_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassInCharge" ADD CONSTRAINT "ClassInCharge_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
