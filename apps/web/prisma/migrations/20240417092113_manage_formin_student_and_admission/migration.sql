-- AlterTable
ALTER TABLE "AdmissionForm" ADD COLUMN     "formId" UUID;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "formId" UUID;

-- AddForeignKey
ALTER TABLE "AdmissionForm" ADD CONSTRAINT "AdmissionForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
