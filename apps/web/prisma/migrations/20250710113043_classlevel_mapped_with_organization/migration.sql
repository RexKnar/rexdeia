-- AlterTable
ALTER TABLE "ClassLevel" ADD COLUMN     "organizationId" UUID;

-- AddForeignKey
ALTER TABLE "ClassLevel" ADD CONSTRAINT "ClassLevel_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
