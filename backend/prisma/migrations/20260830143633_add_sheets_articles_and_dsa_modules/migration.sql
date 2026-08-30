/*
  Warnings:

  - You are about to drop the `_CompanyToProblem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sheetId,slug]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_CompanyToProblem" DROP CONSTRAINT "_CompanyToProblem_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToProblem" DROP CONSTRAINT "_CompanyToProblem_B_fkey";

-- DropIndex
DROP INDEX "Topic_name_key";

-- DropIndex
DROP INDEX "Topic_slug_key";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "logo" TEXT;

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "dsaModuleId" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "revision" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "description" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sheetId" TEXT;

-- DropTable
DROP TABLE "_CompanyToProblem";

-- CreateTable
CREATE TABLE "Sheet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DsaModule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "DsaModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemCompany" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProblemCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemArticle" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "statement" TEXT,
    "examples" TEXT,
    "bruteForce" TEXT,
    "betterApproach" TEXT,
    "optimalApproach" TEXT,
    "algorithm" TEXT,
    "code" TEXT,
    "complexity" TEXT,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_name_key" ON "Sheet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_slug_key" ON "Sheet"("slug");

-- CreateIndex
CREATE INDEX "DsaModule_topicId_idx" ON "DsaModule"("topicId");

-- CreateIndex
CREATE INDEX "ProblemCompany_problemId_idx" ON "ProblemCompany"("problemId");

-- CreateIndex
CREATE INDEX "ProblemCompany_companyId_idx" ON "ProblemCompany"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemCompany_problemId_companyId_key" ON "ProblemCompany"("problemId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemArticle_problemId_key" ON "ProblemArticle"("problemId");

-- CreateIndex
CREATE INDEX "ProblemArticle_problemId_idx" ON "ProblemArticle"("problemId");

-- CreateIndex
CREATE INDEX "Bookmark_problemId_idx" ON "Bookmark"("problemId");

-- CreateIndex
CREATE INDEX "Problem_dsaModuleId_idx" ON "Problem"("dsaModuleId");

-- CreateIndex
CREATE INDEX "Topic_sheetId_idx" ON "Topic"("sheetId");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_sheetId_slug_key" ON "Topic"("sheetId", "slug");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DsaModule" ADD CONSTRAINT "DsaModule_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_dsaModuleId_fkey" FOREIGN KEY ("dsaModuleId") REFERENCES "DsaModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemCompany" ADD CONSTRAINT "ProblemCompany_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemCompany" ADD CONSTRAINT "ProblemCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemArticle" ADD CONSTRAINT "ProblemArticle_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
