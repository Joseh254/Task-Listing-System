/*
  Warnings:

  - You are about to drop the column `status` on the `task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "status",
ADD COLUMN     "Progress" INTEGER DEFAULT 0,
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completed" BOOLEAN DEFAULT false;
