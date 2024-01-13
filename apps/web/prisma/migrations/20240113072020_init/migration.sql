-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'TeachingStaff', 'NonTeachingStaff', 'Student', 'User');

-- CreateEnum
CREATE TYPE "StaffType" AS ENUM ('Teaching', 'NonTeaching', 'Principal', 'Correspondent');

-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('UnitTest', 'TermTest', 'ClassTest');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('Pending', 'Rejected', 'Active');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('Active', 'InActive', 'Resigned', 'Suspended', 'Fired');

-- CreateEnum
CREATE TYPE "AdmissionStatus" AS ENUM ('Received', 'UnderReview', 'Waitlisted', 'Accepted', 'Rejected', 'Deferred', 'Withdrawn', 'Enrolled', 'Archived', 'DirectStudentEntry');

-- CreateTable
CREATE TABLE "Account" (
    "_id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Session" (
    "_id" UUID NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "User" (
    "_id" UUID NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "username" TEXT,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'User',
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "organizationId" UUID NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "institute" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "UserOrganization" (
    "_id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "branchId" UUID,

    CONSTRAINT "UserOrganization_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "AdmissionForm" (
    "_id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "status" "AdmissionStatus" NOT NULL,
    "formId" UUID NOT NULL,

    CONSTRAINT "AdmissionForm_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "EnquiryForm" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "fatherOccupation" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "motherOccupation" TEXT NOT NULL,
    "guardianName" TEXT NOT NULL,
    "guardianOccupation" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "schoolName10th" TEXT NOT NULL,
    "obtainedMark10th" TEXT NOT NULL,
    "yearOfPassing10th" TEXT NOT NULL,
    "mediumOfEducation10th" TEXT NOT NULL,
    "schoolName12th" TEXT NOT NULL,
    "obtainedMark12th" TEXT NOT NULL,
    "yearOfPassing12th" TEXT NOT NULL,
    "mediumOfEducation12th" TEXT NOT NULL,
    "formId" UUID,

    CONSTRAINT "EnquiryForm_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Department" (
    "_id" UUID NOT NULL,
    "departmentName" TEXT NOT NULL,
    "noOfYears" TEXT NOT NULL,
    "departmentCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "branchId" UUID,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Regulation" (
    "_id" UUID NOT NULL,
    "regulationName" TEXT NOT NULL,
    "announcedYear" TEXT NOT NULL,
    "endYear" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "branchId" UUID,

    CONSTRAINT "Regulation_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Course" (
    "_id" UUID NOT NULL,
    "courseName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "departmentId" UUID,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Form" (
    "_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" UUID,
    "branchId" UUID,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "_id" UUID NOT NULL,
    "transactionId" TEXT NOT NULL,
    "receipt" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "paymentDate" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'Online',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "PaymentAssociations" (
    "_id" UUID NOT NULL,
    "associationType" TEXT NOT NULL,
    "associationEntityId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "paymentId" UUID,

    CONSTRAINT "PaymentAssociations_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Share" (
    "_id" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "acceptPayment" BOOLEAN NOT NULL DEFAULT false,
    "actualAmount" DOUBLE PRECISION,
    "discountAmount" DOUBLE PRECISION,
    "activeFromDate" TIMESTAMP(3),
    "activeToDate" TIMESTAMP(3),
    "formId" UUID NOT NULL,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Student" (
    "_id" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "aadharCardNumber" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "fatherOccupation" TEXT NOT NULL,
    "fatherPhoneNumber" TEXT,
    "guardiansOccupation" TEXT NOT NULL,
    "guardianName" TEXT NOT NULL,
    "guardianPhoneNumber" TEXT,
    "motherName" TEXT NOT NULL,
    "motherOccupation" TEXT NOT NULL,
    "motherPhoneNumber" TEXT,
    "motherTongue" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "religion" TEXT,
    "status" "StudentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "additionalAttributes" JSONB NOT NULL,
    "sectionId" UUID,
    "userId" UUID NOT NULL,
    "branchId" UUID NOT NULL,
    "batchId" UUID,
    "organizationId" UUID NOT NULL,
    "formId" UUID NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "_id" UUID NOT NULL,
    "type" "StaffType" NOT NULL,
    "aadharCardNumber" TEXT NOT NULL,
    "annualIncome" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dateOfJoining" TEXT NOT NULL,
    "status" "StaffStatus" NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organizationId" UUID,
    "branchId" UUID,
    "sectionId" UUID,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startYear" TEXT NOT NULL,
    "endYear" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Class" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "batchId" UUID,
    "branchId" UUID NOT NULL,
    "regulationId" UUID,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "SectionSubject" (
    "sectionId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,

    CONSTRAINT "SectionSubject_pkey" PRIMARY KEY ("sectionId","subjectId")
);

-- CreateTable
CREATE TABLE "Section" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "faculty" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "mediumId" UUID NOT NULL,
    "classId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "subjectIds" UUID[],
    "subjectId" UUID,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "_id" UUID NOT NULL,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sectionId" UUID[],

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Group" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Medium" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medium_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Test" (
    "_id" UUID NOT NULL,
    "testType" "TestType" NOT NULL,
    "testNumber" INTEGER NOT NULL,
    "studentMarks" JSONB NOT NULL,
    "outOfMark" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userId_key" ON "Staff"("userId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionForm" ADD CONSTRAINT "AdmissionForm_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionForm" ADD CONSTRAINT "AdmissionForm_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionForm" ADD CONSTRAINT "AdmissionForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryForm" ADD CONSTRAINT "EnquiryForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regulation" ADD CONSTRAINT "Regulation_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAssociations" ADD CONSTRAINT "PaymentAssociations_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "Regulation"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionSubject" ADD CONSTRAINT "SectionSubject_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionSubject" ADD CONSTRAINT "SectionSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_mediumId_fkey" FOREIGN KEY ("mediumId") REFERENCES "Medium"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medium" ADD CONSTRAINT "Medium_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
