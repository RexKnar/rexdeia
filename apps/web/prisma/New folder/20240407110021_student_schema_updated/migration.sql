/*
  Warnings:

  - The primary key for the `StudentMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `_id` was added to the `StudentMapping` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "StudentMapping" DROP CONSTRAINT "StudentMapping_pkey",
ADD COLUMN     "_id" UUID NOT NULL,
ADD CONSTRAINT "StudentMapping_pkey" PRIMARY KEY ("_id");
