/*
  Warnings:

  - You are about to drop the `enrollment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "enrollment" DROP CONSTRAINT "enrollment_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "enrollment";
