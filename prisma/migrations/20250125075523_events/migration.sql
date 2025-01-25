-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "competitionCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAttendee" (
    "eventId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendee_applicationId_key" ON "EventAttendee"("applicationId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_competitionCode_fkey" FOREIGN KEY ("competitionCode") REFERENCES "Competition"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Attendee"("applicationId") ON DELETE CASCADE ON UPDATE CASCADE;
