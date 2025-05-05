-- DropForeignKey
ALTER TABLE "InstituteCourse" DROP CONSTRAINT "InstituteCourse_branchId_fkey";

-- DropForeignKey
ALTER TABLE "InstituteCourse" DROP CONSTRAINT "InstituteCourse_organizationId_fkey";

-- AlterTable
ALTER TABLE "CourseCategory" ADD COLUMN     "branchId" UUID,
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" UUID,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "InstituteCourse" ALTER COLUMN "branchId" DROP NOT NULL,
ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "_CourseCategories" ADD CONSTRAINT "_CourseCategories_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CourseCategories_AB_unique";

-- CreateTable
CREATE TABLE "InstituteCourseModule" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "instituteCourseId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "branchId" UUID,

    CONSTRAINT "InstituteCourseModule_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "InstituteCourseChapter" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "branchId" UUID,

    CONSTRAINT "InstituteCourseChapter_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "InstituteCourseChapterItem" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "languageId" UUID,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "branchId" UUID,

    CONSTRAINT "InstituteCourseChapterItem_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "_InstituteCourseChapterModule" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_InstituteCourseChapterModule_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_InstituteCourseChapterModule_B_index" ON "_InstituteCourseChapterModule"("B");

-- AddForeignKey
ALTER TABLE "InstituteCourse" ADD CONSTRAINT "InstituteCourse_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourse" ADD CONSTRAINT "InstituteCourse_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseCategory" ADD CONSTRAINT "CourseCategory_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourseModule" ADD CONSTRAINT "InstituteCourseModule_instituteCourseId_fkey" FOREIGN KEY ("instituteCourseId") REFERENCES "InstituteCourse"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourseModule" ADD CONSTRAINT "InstituteCourseModule_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourseChapter" ADD CONSTRAINT "InstituteCourseChapter_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourseChapterItem" ADD CONSTRAINT "InstituteCourseChapterItem_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstituteCourseChapterModule" ADD CONSTRAINT "_InstituteCourseChapterModule_A_fkey" FOREIGN KEY ("A") REFERENCES "InstituteCourseChapter"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstituteCourseChapterModule" ADD CONSTRAINT "_InstituteCourseChapterModule_B_fkey" FOREIGN KEY ("B") REFERENCES "InstituteCourseModule"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
