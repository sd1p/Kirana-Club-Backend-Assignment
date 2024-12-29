/*
  Warnings:

  - You are about to drop the column `error` on the `JobError` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `JobError` table. All the data in the column will be lost.
  - Added the required column `message` to the `JobError` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobError" DROP COLUMN "error",
DROP COLUMN "storeId",
ADD COLUMN     "message" TEXT NOT NULL;
