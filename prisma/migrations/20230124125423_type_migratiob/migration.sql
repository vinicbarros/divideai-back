/*
  Warnings:

  - The values [paid,pending] on the enum `billType` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,accepted,rejected] on the enum `requestType` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `billStatus` on table `bill` required. This step will fail if there are existing NULL values in that column.
  - Made the column `requestStatus` on table `friendship` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paymentStatus` on table `userBill` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "billType_new" AS ENUM ('PAID', 'PENDING');
ALTER TABLE "bill" ALTER COLUMN "billStatus" TYPE "billType_new" USING ("billStatus"::text::"billType_new");
ALTER TABLE "userBill" ALTER COLUMN "paymentStatus" TYPE "billType_new" USING ("paymentStatus"::text::"billType_new");
ALTER TYPE "billType" RENAME TO "billType_old";
ALTER TYPE "billType_new" RENAME TO "billType";
DROP TYPE "billType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "requestType_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
ALTER TABLE "friendship" ALTER COLUMN "requestStatus" TYPE "requestType_new" USING ("requestStatus"::text::"requestType_new");
ALTER TYPE "requestType" RENAME TO "requestType_old";
ALTER TYPE "requestType_new" RENAME TO "requestType";
DROP TYPE "requestType_old";
COMMIT;

-- AlterTable
ALTER TABLE "bill" ALTER COLUMN "billStatus" SET NOT NULL;

-- AlterTable
ALTER TABLE "friendship" ALTER COLUMN "requestStatus" SET NOT NULL;

-- AlterTable
ALTER TABLE "userBill" ALTER COLUMN "paymentStatus" SET NOT NULL;
