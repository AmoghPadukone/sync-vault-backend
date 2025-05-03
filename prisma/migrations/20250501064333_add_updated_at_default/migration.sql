-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('aws', 'gcp', 'azure');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultProvider" "ProviderType",
ADD COLUMN     "name" TEXT DEFAULT 'Anonymous',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "itemsPerPage" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locale" TEXT NOT NULL DEFAULT 'en-US',
    "dateFormat" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
    "defaultUploadFolderPath" TEXT,
    "notificationEmailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerName" "ProviderType" NOT NULL,
    "bucketName" TEXT,
    "region" TEXT,
    "accessKey" TEXT,
    "secretKey" TEXT,
    "accountName" TEXT,
    "accountKey" TEXT,
    "containerName" TEXT,
    "projectId" TEXT,
    "keyFilename" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "ProviderType" NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "ProviderType" NOT NULL,
    "cloudPath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "folderPath" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "mimeType" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isEnriched" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB,
    "classification" JSONB,
    "lastCloudModified" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedFile" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "sharedUrl" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "targetPath" TEXT,
    "provider" "ProviderType",
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" JSONB,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostMetric" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "ProviderType" NOT NULL,
    "estimatedCost" DOUBLE PRECISION NOT NULL,
    "storageUsedBytes" BIGINT NOT NULL,
    "retrievalBytes" BIGINT,
    "requestsCount" INTEGER,
    "month" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageSuggestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "suggestedAction" TEXT NOT NULL,
    "suggestedClass" TEXT,
    "estimatedSavings" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "ProviderConfig_userId_idx" ON "ProviderConfig"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderConfig_userId_providerName_key" ON "ProviderConfig"("userId", "providerName");

-- CreateIndex
CREATE INDEX "Folder_userId_idx" ON "Folder"("userId");

-- CreateIndex
CREATE INDEX "Folder_userId_isFavorite_idx" ON "Folder"("userId", "isFavorite");

-- CreateIndex
CREATE INDEX "Folder_userId_provider_path_idx" ON "Folder"("userId", "provider", "path");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_userId_provider_path_key" ON "Folder"("userId", "provider", "path");

-- CreateIndex
CREATE INDEX "File_userId_idx" ON "File"("userId");

-- CreateIndex
CREATE INDEX "File_userId_provider_folderPath_idx" ON "File"("userId", "provider", "folderPath");

-- CreateIndex
CREATE INDEX "File_userId_provider_cloudPath_idx" ON "File"("userId", "provider", "cloudPath");

-- CreateIndex
CREATE INDEX "File_userId_isFavorite_idx" ON "File"("userId", "isFavorite");

-- CreateIndex
CREATE INDEX "File_userId_isEnriched_idx" ON "File"("userId", "isEnriched");

-- CreateIndex
CREATE INDEX "File_fileName_idx" ON "File"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "File_userId_provider_cloudPath_key" ON "File"("userId", "provider", "cloudPath");

-- CreateIndex
CREATE UNIQUE INDEX "SharedFile_sharedUrl_key" ON "SharedFile"("sharedUrl");

-- CreateIndex
CREATE INDEX "SharedFile_fileId_idx" ON "SharedFile"("fileId");

-- CreateIndex
CREATE INDEX "SharedFile_ownerId_idx" ON "SharedFile"("ownerId");

-- CreateIndex
CREATE INDEX "SharedFile_expiresAt_idx" ON "SharedFile"("expiresAt");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_timestamp_idx" ON "ActivityLog"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "ActivityLog_actionType_idx" ON "ActivityLog"("actionType");

-- CreateIndex
CREATE INDEX "ActivityLog_targetId_idx" ON "ActivityLog"("targetId");

-- CreateIndex
CREATE INDEX "CostMetric_userId_provider_idx" ON "CostMetric"("userId", "provider");

-- CreateIndex
CREATE INDEX "CostMetric_month_idx" ON "CostMetric"("month");

-- CreateIndex
CREATE UNIQUE INDEX "CostMetric_userId_provider_month_key" ON "CostMetric"("userId", "provider", "month");

-- CreateIndex
CREATE INDEX "StorageSuggestion_userId_status_idx" ON "StorageSuggestion"("userId", "status");

-- CreateIndex
CREATE INDEX "StorageSuggestion_fileId_idx" ON "StorageSuggestion"("fileId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderConfig" ADD CONSTRAINT "ProviderConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedFile" ADD CONSTRAINT "SharedFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedFile" ADD CONSTRAINT "SharedFile_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostMetric" ADD CONSTRAINT "CostMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageSuggestion" ADD CONSTRAINT "StorageSuggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageSuggestion" ADD CONSTRAINT "StorageSuggestion_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
