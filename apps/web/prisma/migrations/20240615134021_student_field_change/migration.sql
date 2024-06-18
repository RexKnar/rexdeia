/*
  Warnings:

  - A unique constraint covering the columns `[emisNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emisNumber` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "admissionNumber" TEXT,
ADD COLUMN     "emisNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_emisNumber_key" ON "Student"("emisNumber");
