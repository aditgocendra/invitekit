/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `invitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invitation" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "invitation_slug_key" ON "invitation"("slug");
