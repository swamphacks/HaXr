-- CreateTable
CREATE TABLE "Redeemable" (
    "competitionCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Redeemable_pkey" PRIMARY KEY ("competitionCode","name")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "competitionCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "redeemableName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "transactedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Redeemable" ADD CONSTRAINT "Redeemable_competitionCode_fkey" FOREIGN KEY ("competitionCode") REFERENCES "Competition"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_competitionCode_userId_fkey" FOREIGN KEY ("competitionCode", "userId") REFERENCES "Attendee"("competitionCode", "userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_competitionCode_redeemableName_fkey" FOREIGN KEY ("competitionCode", "redeemableName") REFERENCES "Redeemable"("competitionCode", "name") ON DELETE CASCADE ON UPDATE CASCADE;
