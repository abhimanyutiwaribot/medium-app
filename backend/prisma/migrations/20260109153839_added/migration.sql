/*
  Warnings:

  - You are about to drop the `Blogs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `UserModel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `UserModel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('ARTICLE_VERSION_CREATED', 'ARTICLE_PUBLISHED', 'STREAK_UPDATED');

-- DropForeignKey
ALTER TABLE "Blogs" DROP CONSTRAINT "Blogs_authorId_fkey";

-- AlterTable
ALTER TABLE "UserModel" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Blogs";

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "published_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WinningStreak" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL,
    "longestStreak" INTEGER NOT NULL,
    "lastWriteDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WinningStreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleVersion" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WinningStreak_userId_key" ON "WinningStreak"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleVersion_articleId_version_key" ON "ArticleVersion"("articleId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_username_key" ON "UserModel"("username");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WinningStreak" ADD CONSTRAINT "WinningStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleVersion" ADD CONSTRAINT "ArticleVersion_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
