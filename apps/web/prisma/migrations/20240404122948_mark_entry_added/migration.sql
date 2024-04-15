-- CreateTable
CREATE TABLE "MarkEntry" (
    "_id" UUID NOT NULL,
    "mark" INTEGER NOT NULL,
    "absent" INTEGER NOT NULL,
    "studentId" UUID NOT NULL,
    "academicExamId" UUID NOT NULL,
    "assessmentFormatId" UUID,

    CONSTRAINT "MarkEntry_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "MarkEntry" ADD CONSTRAINT "MarkEntry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkEntry" ADD CONSTRAINT "MarkEntry_academicExamId_fkey" FOREIGN KEY ("academicExamId") REFERENCES "AcademicExams"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkEntry" ADD CONSTRAINT "MarkEntry_assessmentFormatId_fkey" FOREIGN KEY ("assessmentFormatId") REFERENCES "AssessmentFormat"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
