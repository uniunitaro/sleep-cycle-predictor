-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "newEmail" TEXT,
    "nickname" TEXT NOT NULL,
    "avatarUrl" TEXT
);

-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "predictionSrcDuration" TEXT NOT NULL,
    "predictionSrcStartDate" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Config_predictionSrcDuration_fkey" FOREIGN KEY ("predictionSrcDuration") REFERENCES "PredictionSrcDuration" ("duration") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PredictionSrcDuration" (
    "duration" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "configId" INTEGER NOT NULL,
    CONSTRAINT "Calendar_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sleep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "parentSleepId" INTEGER,
    CONSTRAINT "Sleep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Sleep_parentSleepId_fkey" FOREIGN KEY ("parentSleepId") REFERENCES "Sleep" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Config_userId_key" ON "Config"("userId");

-- CreateIndex
CREATE INDEX "Sleep_userId_idx" ON "Sleep"("userId");

-- CreateIndex
CREATE INDEX "Sleep_parentSleepId_idx" ON "Sleep"("parentSleepId");

-- CreateIndex
CREATE INDEX "Sleep_parentSleepId_userId_start_end_idx" ON "Sleep"("parentSleepId", "userId", "start", "end");
