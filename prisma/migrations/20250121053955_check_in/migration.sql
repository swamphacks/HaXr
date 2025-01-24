-- DropIndex
DROP INDEX "Attendee_applicationId_key";

-- AlterTable
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_pkey" PRIMARY KEY ("applicationId");

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
