/*
  Warnings:

  - You are about to drop the column `sectionId` on the `Student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_sectionId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "sectionId";

-- CreateTable
CREATE TABLE "StudentMapping" (
    "studentId" UUID NOT NULL,
    "classId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "groupId" UUID NOT NULL,

    CONSTRAINT "StudentMapping_pkey" PRIMARY KEY ("studentId","classId","sectionId","groupId")
);

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMapping" ADD CONSTRAINT "StudentMapping_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
