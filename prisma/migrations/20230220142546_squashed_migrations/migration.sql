-- CreateTable
CREATE TABLE "Link" (
    "short" TEXT NOT NULL,
    "long" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("short")
);
