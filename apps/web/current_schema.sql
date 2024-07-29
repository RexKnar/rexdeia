-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'TeachingStaff', 'NonTeachingStaff', 'Student', 'User', 'OfficeAdmin', 'HM', 'AHM');

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
CREATE TABLE "Exam" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "examTypeId" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "termId" UUID NOT NULL,
    "batchId" UUID NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ExamType" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branchId" UUID NOT NULL,
    "frequencyId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ExamType_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Term" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branchId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ExamGroup" (
    "_id" UUID NOT NULL,
    "totalMarks" INTEGER,
    "classId" UUID NOT NULL,
    "examId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,

    CONSTRAINT "ExamGroup_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ExamSubject" (
    "_id" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "totalMarks" DECIMAL NOT NULL DEFAULT 0,
    "examGroupId" UUID NOT NULL,
    "convertTo" DECIMAL NOT NULL DEFAULT 0,
    "minMark" DECIMAL NOT NULL DEFAULT 0,
    "groupId" UUID NOT NULL,

    CONSTRAINT "ExamSubject_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ExamSubjectPartition" (
    "_id" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "minMark" DECIMAL NOT NULL,
    "totalMarks" DECIMAL NOT NULL,
    "partitionName" TEXT,
    "examSubjectId" UUID NOT NULL,
    "assessmentFormatId" UUID NOT NULL,
    "convertTo" DECIMAL NOT NULL,
    "dateToConduct" TIMESTAMP(3) NOT NULL,
    "examGroupId" UUID NOT NULL,

    CONSTRAINT "ExamSubjectPartition_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Mark" (
    "_id" UUID NOT NULL,
    "mark" DECIMAL,
    "attandance" INTEGER,
    "studentId" UUID NOT NULL,
    "examSubjectId" UUID NOT NULL,
    "examSubjectPartitionId" UUID NOT NULL,
    "subjectId" UUID,
    "assessmentFormatId" UUID,
    "SubjectMasterId" UUID,
    "userId" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mark_pkey" PRIMARY KEY ("_id")
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
    "formId" UUID,

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
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "aadharCardNumber" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "dob" TEXT NOT NULL,
    "fatherName" TEXT,
    "fatherOccupation" TEXT,
    "fatherPhoneNumber" TEXT,
    "guardiansOccupation" TEXT,
    "guardianName" TEXT,
    "guardianPhoneNumber" TEXT,
    "motherName" TEXT,
    "motherOccupation" TEXT,
    "motherPhoneNumber" TEXT,
    "nationality" TEXT,
    "religion" TEXT,
    "status" "StudentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "additionalAttributes" JSONB NOT NULL,
    "userId" UUID NOT NULL,
    "branchId" UUID NOT NULL,
    "batchId" UUID,
    "organizationId" UUID NOT NULL,
    "sectionId" UUID,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "formId" UUID,
    "fatherEmailId" TEXT,
    "guardianEmailId" TEXT,
    "motherEmailId" TEXT,
    "communityId" UUID,
    "motherTongueId" UUID,
    "admissionNumber" TEXT,
    "emisNumber" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "StudentMapping" (
    "studentId" UUID NOT NULL,
    "classId" UUID NOT NULL,
    "sectionId" UUID,
    "groupId" UUID NOT NULL,
    "_id" UUID NOT NULL,
    "mediumId" UUID,
    "batchId" UUID,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StudentMapping_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "_id" UUID NOT NULL,
    "image" TEXT,
    "aadharCardNumber" TEXT,
    "firstName" TEXT NOT NULL DEFAULT '',
    "middleName" TEXT DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "dateOfBirth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gender" TEXT NOT NULL DEFAULT '',
    "mobile" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "bloodGroup" TEXT,
    "religion" TEXT,
    "nationality" TEXT,
    "specialCategory" TEXT,
    "differentlyAbled" BOOLEAN NOT NULL DEFAULT false,
    "epfNumber" TEXT,
    "fatherName" TEXT,
    "fatherOccupation" TEXT,
    "motherName" TEXT,
    "motherOccupation" TEXT,
    "spouseName" TEXT,
    "spouseOccupation" TEXT,
    "currentAddressLine1" TEXT,
    "currentAddressLine2" TEXT,
    "currentCity" TEXT,
    "currentState" TEXT,
    "currentCountry" TEXT,
    "currentPincode" TEXT,
    "permanentAddress1" TEXT,
    "permanentAddress2" TEXT,
    "permanentCity" TEXT,
    "permanentState" TEXT,
    "permanentPincode" TEXT,
    "permanentCountry" TEXT,
    "birthCertificate" TEXT,
    "communityCertificate" TEXT,
    "childImmunicationCertificate" TEXT,
    "medicalCertificate" TEXT,
    "covidVaccinationCertificate" TEXT,
    "characterCertificate" TEXT,
    "fathersPhoto" TEXT,
    "mothersPhoto" TEXT,
    "spousePhoto" TEXT,
    "incomeCertificate" TEXT,
    "transferCertificate" TEXT,
    "sslcMarksCard" TEXT,
    "pucMarksCard" TEXT,
    "degreeMarksCard" TEXT,
    "pgMarksCard" TEXT,
    "otherCertificate" TEXT,
    "dateOfDetainment" TIMESTAMP(3),
    "dateOfRegularization" TIMESTAMP(3),
    "subjectHandling" TEXT,
    "collegeName" TEXT,
    "passOutYear" TIMESTAMP(3),
    "marksObtained" TEXT,
    "dateOfJoining" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StaffStatus" NOT NULL DEFAULT 'Active',
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organizationId" UUID,
    "branchId" UUID,
    "sectionIds" UUID[],
    "IFSC_Code" TEXT,
    "accountHolderName" TEXT,
    "accountNumber" TEXT,
    "age" TEXT,
    "branchName" TEXT,
    "cps" TEXT,
    "dateOfRetirement" TIMESTAMP(3),
    "employeeId" TEXT,
    "enrollmentId" TEXT,
    "tpf" TEXT,
    "communityId" UUID,
    "designationId" UUID,
    "employmentTypeId" UUID,
    "motherTongueId" UUID,
    "natureOfPostingId" UUID,
    "staffCategoryId" UUID,
    "mediumOfTeachingId" UUID,
    "otherSubjectId" UUID,
    "primarySubjectId" UUID,
    "secondarySubjectId" UUID,
    "udiseNumber" TEXT,
    "enrollmentNumber" SERIAL NOT NULL,

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
    "currentAcademicYear" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Class" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "batchId" UUID,
    "branchId" UUID NOT NULL,
    "regulationId" UUID,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "StaffSection" (
    "sectionId" UUID NOT NULL,
    "staffId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffSection_pkey" PRIMARY KEY ("sectionId","staffId")
);

-- CreateTable
CREATE TABLE "AcademicSubjectForStaff" (
    "staffId" UUID NOT NULL,
    "subjectId" UUID,
    "academicYearId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "isIncharge" BOOLEAN NOT NULL DEFAULT false,
    "_id" UUID NOT NULL,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "AcademicSubjectForStaff_pkey" PRIMARY KEY ("_id")
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
    "subjectId" UUID,
    "staffId" UUID,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "SectionToGroups" (
    "sectionId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SectionToGroups_pkey" PRIMARY KEY ("sectionId","groupId")
);

-- CreateTable
CREATE TABLE "SubjectMaster" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "branchId" UUID,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectMaster_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "_id" UUID NOT NULL,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "elective" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "regulationId" UUID NOT NULL,
    "sectionId" UUID[],
    "branchId" UUID,
    "subjectMasterId" UUID NOT NULL,
    "classId" UUID NOT NULL,
    "subjectOrder" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "StudentElectiveSubject" (
    "_id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "subjectMasterId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "academicYearId" UUID NOT NULL,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "StudentElectiveSubject_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "AssessmentFormat" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "hasMarkEntry" BOOLEAN,
    "parentId" UUID,
    "branchId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentFormat_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "SubjectToAssessmentFormat" (
    "assessmentFormatId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectToAssessmentFormat_pkey" PRIMARY KEY ("assessmentFormatId","subjectId")
);

-- CreateTable
CREATE TABLE "SubjectToGroup" (
    "subjectId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "classId" UUID NOT NULL,

    CONSTRAINT "SubjectToGroup_pkey" PRIMARY KEY ("groupId","subjectId")
);

-- CreateTable
CREATE TABLE "SubjectToSubjectType" (
    "subjectId" UUID NOT NULL,
    "subjectTypeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectToSubjectType_pkey" PRIMARY KEY ("subjectTypeId","subjectId")
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
CREATE TABLE "subjectType" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "subjectType_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "GradeScales" (
    "_id" UUID NOT NULL,
    "startValue" TEXT NOT NULL,
    "endValue" TEXT NOT NULL,
    "gradeName" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "gradeId" UUID,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GradeScales_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Community" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Language" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "StaffCategory" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StaffCategory_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "EmploymentType" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EmploymentType_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Designation" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Designation_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "NatureOfPosting" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" UUID NOT NULL,

    CONSTRAINT "NatureOfPosting_pkey" PRIMARY KEY ("_id")
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
CREATE UNIQUE INDEX "Mark_studentId_examSubjectId_examSubjectPartitionId_key" ON "Mark"("studentId", "examSubjectId", "examSubjectPartitionId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_emisNumber_key" ON "Student"("emisNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userId_key" ON "Staff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicSubjectForStaff_academicYearId_staffId_sectionId_su_key" ON "AcademicSubjectForStaff"("academicYearId", "staffId", "sectionId", "subjectId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudentElectiveSubject_academicYearId_studentId_subjectId_d_key" ON "StudentElectiveSubject"("academicYearId", "studentId", "subjectId", "deletedAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_examTypeId_fkey" FOREIGN KEY ("examTypeId") REFERENCES "ExamType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamType" ADD CONSTRAINT "ExamType_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGroup" ADD CONSTRAINT "ExamGroup_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGroup" ADD CONSTRAINT "ExamGroup_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGroup" ADD CONSTRAINT "ExamGroup_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_examGroupId_fkey" FOREIGN KEY ("examGroupId") REFERENCES "ExamGroup"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubjectPartition" ADD CONSTRAINT "ExamSubjectPartition_assessmentFormatId_fkey" FOREIGN KEY ("assessmentFormatId") REFERENCES "AssessmentFormat"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubjectPartition" ADD CONSTRAINT "ExamSubjectPartition_examGroupId_fkey" FOREIGN KEY ("examGroupId") REFERENCES "ExamGroup"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubjectPartition" ADD CONSTRAINT "ExamSubjectPartition_examSubjectId_fkey" FOREIGN KEY ("examSubjectId") REFERENCES "ExamSubject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubjectPartition" ADD CONSTRAINT "ExamSubjectPartition_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_SubjectMasterId_fkey" FOREIGN KEY ("SubjectMasterId") REFERENCES "SubjectMaster"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_assessmentFormatId_fkey" FOREIGN KEY ("assessmentFormatId") REFERENCES "AssessmentFormat"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_examSubjectId_fkey" FOREIGN KEY ("examSubjectId") REFERENCES "ExamSubject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_examSubjectPartitionId_fkey" FOREIGN KEY ("examSubjectPartitionId") REFERENCES "ExamSubjectPartition"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionForm" ADD CONSTRAINT "AdmissionForm_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionForm" ADD CONSTRAINT "AdmissionForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionForm" ADD CONSTRAINT "AdmissionForm_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryForm" ADD CONSTRAINT "EnquiryForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regulation" ADD CONSTRAINT "Regulation_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAssociations" ADD CONSTRAINT "PaymentAssociations_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_motherTongueId_fkey" FOREIGN KEY ("motherTongueId") REFERENCES "Language"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_mediumId_fkey" FOREIGN KEY ("mediumId") REFERENCES "Medium"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_employmentTypeId_fkey" FOREIGN KEY ("employmentTypeId") REFERENCES "EmploymentType"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_mediumOfTeachingId_fkey" FOREIGN KEY ("mediumOfTeachingId") REFERENCES "Medium"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_motherTongueId_fkey" FOREIGN KEY ("motherTongueId") REFERENCES "Language"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_natureOfPostingId_fkey" FOREIGN KEY ("natureOfPostingId") REFERENCES "NatureOfPosting"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_otherSubjectId_fkey" FOREIGN KEY ("otherSubjectId") REFERENCES "SubjectMaster"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_primarySubjectId_fkey" FOREIGN KEY ("primarySubjectId") REFERENCES "SubjectMaster"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_secondarySubjectId_fkey" FOREIGN KEY ("secondarySubjectId") REFERENCES "SubjectMaster"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_staffCategoryId_fkey" FOREIGN KEY ("staffCategoryId") REFERENCES "StaffCategory"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "Regulation"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffSection" ADD CONSTRAINT "StaffSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffSection" ADD CONSTRAINT "StaffSection_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicSubjectForStaff" ADD CONSTRAINT "AcademicSubjectForStaff_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicSubjectForStaff" ADD CONSTRAINT "AcademicSubjectForStaff_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicSubjectForStaff" ADD CONSTRAINT "AcademicSubjectForStaff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicSubjectForStaff" ADD CONSTRAINT "AcademicSubjectForStaff_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_mediumId_fkey" FOREIGN KEY ("mediumId") REFERENCES "Medium"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionToGroups" ADD CONSTRAINT "SectionToGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionToGroups" ADD CONSTRAINT "SectionToGroups_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectMaster" ADD CONSTRAINT "SubjectMaster_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "Regulation"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_subjectMasterId_fkey" FOREIGN KEY ("subjectMasterId") REFERENCES "SubjectMaster"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentElectiveSubject" ADD CONSTRAINT "StudentElectiveSubject_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "Batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentElectiveSubject" ADD CONSTRAINT "StudentElectiveSubject_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentElectiveSubject" ADD CONSTRAINT "StudentElectiveSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentElectiveSubject" ADD CONSTRAINT "StudentElectiveSubject_subjectMasterId_fkey" FOREIGN KEY ("subjectMasterId") REFERENCES "SubjectMaster"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentFormat" ADD CONSTRAINT "AssessmentFormat_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentFormat" ADD CONSTRAINT "AssessmentFormat_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "AssessmentFormat"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToAssessmentFormat" ADD CONSTRAINT "SubjectToAssessmentFormat_assessmentFormatId_fkey" FOREIGN KEY ("assessmentFormatId") REFERENCES "AssessmentFormat"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToAssessmentFormat" ADD CONSTRAINT "SubjectToAssessmentFormat_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToGroup" ADD CONSTRAINT "SubjectToGroup_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToGroup" ADD CONSTRAINT "SubjectToGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToGroup" ADD CONSTRAINT "SubjectToGroup_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToSubjectType" ADD CONSTRAINT "SubjectToSubjectType_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectToSubjectType" ADD CONSTRAINT "SubjectToSubjectType_subjectTypeId_fkey" FOREIGN KEY ("subjectTypeId") REFERENCES "subjectType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medium" ADD CONSTRAINT "Medium_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectType" ADD CONSTRAINT "subjectType_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeScales" ADD CONSTRAINT "GradeScales_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NatureOfPosting" ADD CONSTRAINT "NatureOfPosting_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

