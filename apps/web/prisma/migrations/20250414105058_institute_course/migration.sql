-- CreateTable
CREATE TABLE "InstituteCourse" (
    "_id" UUID NOT NULL,
    "courseName" TEXT NOT NULL,
    "description" TEXT,
    "tagLine" TEXT,
    "languageId" UUID NOT NULL,
    "price" TEXT NOT NULL,
    "discountPrice" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationId" UUID NOT NULL,

    CONSTRAINT "InstituteCourse_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "InstituteCourseHighlight" (
    "_id" UUID NOT NULL,
    "keyHighlight" TEXT NOT NULL,
    "description" TEXT,
    "instituteCourseId" UUID NOT NULL,

    CONSTRAINT "InstituteCourseHighlight_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "InstituteCourseOutcome" (
    "_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "instituteCourseId" UUID NOT NULL,

    CONSTRAINT "InstituteCourseOutcome_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "InstituteCourseFAQ" (
    "_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "instituteCourseId" UUID NOT NULL,

    CONSTRAINT "InstituteCourseFAQ_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "CourseCategory" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "courseCategoryId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CourseCategory_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "_CourseCategories" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseCategories_AB_unique" ON "_CourseCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseCategories_B_index" ON "_CourseCategories"("B");

-- AddForeignKey
ALTER TABLE "InstituteCourse" ADD CONSTRAINT "InstituteCourse_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourse" ADD CONSTRAINT "InstituteCourse_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourse" ADD CONSTRAINT "InstituteCourse_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourseHighlight" ADD CONSTRAINT "InstituteCourseHighlight_instituteCourseId_fkey" FOREIGN KEY ("instituteCourseId") REFERENCES "InstituteCourse"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourseOutcome" ADD CONSTRAINT "InstituteCourseOutcome_instituteCourseId_fkey" FOREIGN KEY ("instituteCourseId") REFERENCES "InstituteCourse"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourseFAQ" ADD CONSTRAINT "InstituteCourseFAQ_instituteCourseId_fkey" FOREIGN KEY ("instituteCourseId") REFERENCES "InstituteCourse"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseCategory" ADD CONSTRAINT "CourseCategory_courseCategoryId_fkey" FOREIGN KEY ("courseCategoryId") REFERENCES "CourseCategory"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseCategories" ADD CONSTRAINT "_CourseCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseCategory"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseCategories" ADD CONSTRAINT "_CourseCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "InstituteCourse"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
