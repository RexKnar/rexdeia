-- CreateTable
CREATE TABLE "SubjectToCategory" (
    "subjectId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectToCategory_pkey" PRIMARY KEY ("categoryId","subjectId")
);

-- AddForeignKey
ALTER TABLE "SubjectToCategory" ADD CONSTRAINT "SubjectToCategory_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToCategory" ADD CONSTRAINT "SubjectToCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
