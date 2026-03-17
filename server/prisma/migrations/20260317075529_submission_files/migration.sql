/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "submission" DROP COLUMN "fileUrl";

-- CreateTable
CREATE TABLE "submissionFile" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissionFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "submissionFile" ADD CONSTRAINT "submissionFile_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
