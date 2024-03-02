-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "category" TEXT,
ADD COLUMN     "collegeName" TEXT,
ADD COLUMN     "dateOfDetainment" TIMESTAMP(3),
ADD COLUMN     "dateOfRegularization" TIMESTAMP(3),
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "employmentType" TEXT,
ADD COLUMN     "marksObtained" TEXT,
ADD COLUMN     "passOutYear" TIMESTAMP(3),
ADD COLUMN     "subjectHandling" TEXT;
