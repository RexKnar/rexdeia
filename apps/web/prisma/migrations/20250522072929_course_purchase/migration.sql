-- CreateTable
CREATE TABLE "CoursePurchaseRecord" (
    "_id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "studentId" UUID,
    "paymentType" TEXT NOT NULL DEFAULT 'FullPayment',
    "actualAmount" DOUBLE PRECISION DEFAULT 0,
    "discountAmount" DOUBLE PRECISION DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidFullPayment" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organizationId" UUID NOT NULL,

    CONSTRAINT "CoursePurchaseRecord_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "_id" UUID NOT NULL,
    "referenceId" TEXT NOT NULL,
    "coursePurchaseId" UUID NOT NULL,
    "paymentId" UUID,
    "paymentMethod" TEXT NOT NULL DEFAULT 'Online',
    "amount" DOUBLE PRECISION DEFAULT 0,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "CoursePurchaseRecord" ADD CONSTRAINT "CoursePurchaseRecord_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "InstituteCourse"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePurchaseRecord" ADD CONSTRAINT "CoursePurchaseRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePurchaseRecord" ADD CONSTRAINT "CoursePurchaseRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePurchaseRecord" ADD CONSTRAINT "CoursePurchaseRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_coursePurchaseId_fkey" FOREIGN KEY ("coursePurchaseId") REFERENCES "CoursePurchaseRecord"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
