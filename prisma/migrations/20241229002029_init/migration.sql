-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Store" (
    "storeId" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "areaCode" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("storeId")
);

-- CreateTable
CREATE TABLE "Job" (
    "jobId" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PROCESSING',
    "visits" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "JobError" (
    "id" SERIAL NOT NULL,
    "storeId" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "JobError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_storeId_key" ON "Store"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "JobError_jobId_key" ON "JobError"("jobId");

-- AddForeignKey
ALTER TABLE "JobError" ADD CONSTRAINT "JobError_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE RESTRICT ON UPDATE CASCADE;
