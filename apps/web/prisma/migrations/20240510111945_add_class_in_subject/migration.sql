/*
  Warnings:

  - You are about to drop the `SectionSubject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `classId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SectionSubject" DROP CONSTRAINT "SectionSubject_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "SectionSubject" DROP CONSTRAINT "SectionSubject_subjectId_fkey";

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "classId" UUID NOT NULL;

-- DropTable
DROP TABLE "SectionSubject";

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
