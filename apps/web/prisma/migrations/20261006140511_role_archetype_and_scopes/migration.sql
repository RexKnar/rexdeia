-- CreateEnum
CREATE TYPE "RoleArchetype" AS ENUM ('ORGANIZATION_ADMIN', 'BRANCH_MANAGER', 'HM', 'AHM', 'CLASS_TEACHER', 'TEACHING_STAFF', 'FINANCE_OFFICER', 'HR_OFFICER', 'INSTRUCTOR', 'PARENT', 'STUDENT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PermissionScope" AS ENUM ('BRANCH', 'ASSIGNED_LEVELS', 'ASSIGNED_SECTIONS', 'ASSIGNED_SUBJECTS', 'OWN_RECORDS', 'OWN_WARDS');

-- DropIndex
DROP INDEX "Student_firstName_lastName_emisNumber_phoneNumber_emailId_a_idx";

-- AlterTable
ALTER TABLE "ModuleAccess" ADD COLUMN     "scope" "PermissionScope" NOT NULL DEFAULT 'BRANCH';

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "archetype" "RoleArchetype" NOT NULL DEFAULT 'CUSTOM',
ADD COLUMN     "isSystemRole" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Exam_branchId_batchId_idx" ON "Exam"("branchId", "batchId");

-- CreateIndex
CREATE INDEX "ExamGroup_examId_sectionId_idx" ON "ExamGroup"("examId", "sectionId");

-- CreateIndex
CREATE INDEX "ExamGroup_classId_idx" ON "ExamGroup"("classId");

-- CreateIndex
CREATE INDEX "ExamSubject_examGroupId_idx" ON "ExamSubject"("examGroupId");

-- CreateIndex
CREATE INDEX "ExamSubject_subjectId_idx" ON "ExamSubject"("subjectId");

-- CreateIndex
CREATE INDEX "Mark_examSubjectId_idx" ON "Mark"("examSubjectId");

-- CreateIndex
CREATE INDEX "Mark_studentId_idx" ON "Mark"("studentId");

-- CreateIndex
CREATE INDEX "Mark_subjectId_idx" ON "Mark"("subjectId");

-- CreateIndex
CREATE INDEX "Section_classId_academicYearId_idx" ON "Section"("classId", "academicYearId");

-- CreateIndex
CREATE INDEX "Student_branchId_organizationId_idx" ON "Student"("branchId", "organizationId");

-- CreateIndex
CREATE INDEX "Student_phoneNumber_idx" ON "Student"("phoneNumber");

-- CreateIndex
CREATE INDEX "Student_emailId_idx" ON "Student"("emailId");

-- CreateIndex
CREATE INDEX "Student_aadharCardNumber_idx" ON "Student"("aadharCardNumber");

-- CreateIndex
CREATE INDEX "Student_firstName_lastName_idx" ON "Student"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "StudentMapping_studentId_isCurrent_idx" ON "StudentMapping"("studentId", "isCurrent");

-- CreateIndex
CREATE INDEX "StudentMapping_classId_sectionId_batchId_idx" ON "StudentMapping"("classId", "sectionId", "batchId");
