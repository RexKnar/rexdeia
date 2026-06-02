-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('admin', 'hm', 'ahm', 'staff', 'tech');

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "roleType" "RoleType";
