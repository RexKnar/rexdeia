-- CreateTable
CREATE TABLE "Exam" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sectionId" UUID,
    "totalMarks" INTEGER NOT NULL,
    "convertToPercentage" INTEGER NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ExamGroup" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "convertToPercentage" INTEGER NOT NULL,
    "exam1Id" UUID,

    CONSTRAINT "ExamGroup_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ExamSubject" (
    "_id" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "convertToPercentage" INTEGER NOT NULL,
    "examGroupId" UUID,

    CONSTRAINT "ExamSubject_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ExamSubjectPartition" (
    "_id" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "minMark" INTEGER NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "convertToPercentage" INTEGER NOT NULL,
    "partitionName" TEXT NOT NULL,
    "examSubjectId" UUID,

    CONSTRAINT "ExamSubjectPartition_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGroup" ADD CONSTRAINT "ExamGroup_exam1Id_fkey" FOREIGN KEY ("exam1Id") REFERENCES "Exam"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_examGroupId_fkey" FOREIGN KEY ("examGroupId") REFERENCES "ExamGroup"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubjectPartition" ADD CONSTRAINT "ExamSubjectPartition_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubjectPartition" ADD CONSTRAINT "ExamSubjectPartition_examSubjectId_fkey" FOREIGN KEY ("examSubjectId") REFERENCES "ExamSubject"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
