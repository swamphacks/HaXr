/*
  Warnings:

  - You are about to drop the column `confirmation_date` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `questions` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `registration_close` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `registration_open` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `released` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `visible` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `apply_close` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apply_open` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confirm_by` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `decision_release` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preview` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Made the column `location` on table `Competition` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_competition_code_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_user_id_fkey";

-- AlterTable
ALTER TABLE "Competition" DROP COLUMN "confirmation_date",
DROP COLUMN "questions",
DROP COLUMN "registration_close",
DROP COLUMN "registration_open",
DROP COLUMN "released",
DROP COLUMN "visible",
ADD COLUMN     "apply_close" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "apply_open" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "confirm_by" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "decision_release" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "preview" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "location_url" DROP DEFAULT;

-- DropTable
DROP TABLE "Application";

-- DropEnum
DROP TYPE "Status";
