-- CreateEnum
CREATE TYPE "Status" AS ENUM ('STARTED', 'APPLIED', 'REJECTED', 'WAITLISTED', 'ACCEPTED', 'NOT_ATTENDING', 'ATTENDING');

-- CreateTable
CREATE TABLE "AdminLink" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "addedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterestedPerson" (
    "id" TEXT NOT NULL,
    "competitionCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "signedUpAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterestedPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "competitionCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'STARTED',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "competitionCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "badgeId" TEXT,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "InterestedPerson_competitionCode_email_key" ON "InterestedPerson"("competitionCode", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Application_competitionCode_userId_key" ON "Application"("competitionCode", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_applicationId_key" ON "Attendee"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_badgeId_key" ON "Attendee"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_competitionCode_userId_key" ON "Attendee"("competitionCode", "userId");

-- AddForeignKey
ALTER TABLE "InterestedPerson" ADD CONSTRAINT "InterestedPerson_competitionCode_fkey" FOREIGN KEY ("competitionCode") REFERENCES "Competition"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_competitionCode_fkey" FOREIGN KEY ("competitionCode") REFERENCES "Competition"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_competitionCode_fkey" FOREIGN KEY ("competitionCode") REFERENCES "Competition"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
