-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "max_attendees" INTEGER,
ADD COLUMN     "waitlist_close" TIMESTAMP(3),
ADD COLUMN     "waitlist_open" TIMESTAMP(3);
