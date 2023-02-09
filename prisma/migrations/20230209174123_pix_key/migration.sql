/*
  Warnings:

  - Added the required column `pixKey` to the `bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bill" ADD COLUMN     "pixKey" TEXT NOT NULL;
