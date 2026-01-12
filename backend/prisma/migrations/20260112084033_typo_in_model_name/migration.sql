/*
  Warnings:

  - You are about to drop the `WinningStreak` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WinningStreak" DROP CONSTRAINT "WinningStreak_userId_fkey";

-- DropTable
DROP TABLE "WinningStreak";

-- CreateTable
CREATE TABLE "WritingStreak" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL,
    "longestStreak" INTEGER NOT NULL,
    "lastWriteDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WritingStreak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WritingStreak_userId_key" ON "WritingStreak"("userId");

-- AddForeignKey
ALTER TABLE "WritingStreak" ADD CONSTRAINT "WritingStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
