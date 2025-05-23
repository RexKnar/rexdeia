-- AlterTable
ALTER TABLE "CourseBatch" ALTER COLUMN "totalSeats" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "InstituteCourse" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "aadharCardNumber" DROP NOT NULL,
ALTER COLUMN "gender" SET DEFAULT '-',
ALTER COLUMN "dob" DROP NOT NULL;
