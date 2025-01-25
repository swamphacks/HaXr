/*
  Warnings:

  - A unique constraint covering the columns `[eventId,applicationId]` on the table `EventAttendee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EventAttendee_applicationId_key";

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendee_eventId_applicationId_key" ON "EventAttendee"("eventId", "applicationId");
