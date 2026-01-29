-- CreateTable
CREATE TABLE "WritingDay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WritingDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WritingDay_userId_date_key" ON "WritingDay"("userId", "date");
