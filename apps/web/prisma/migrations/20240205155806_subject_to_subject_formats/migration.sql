-- CreateTable
CREATE TABLE "SubjectToSubjectFormat" (
    "subjectFormatId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectToSubjectFormat_pkey" PRIMARY KEY ("subjectFormatId","subjectId")
);

-- AddForeignKey
ALTER TABLE "SubjectToSubjectFormat" ADD CONSTRAINT "SubjectToSubjectFormat_subjectFormatId_fkey" FOREIGN KEY ("subjectFormatId") REFERENCES "SubjectFormat"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToSubjectFormat" ADD CONSTRAINT "SubjectToSubjectFormat_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
