/*
  Warnings:

  - A unique constraint covering the columns `[payment_intent_id]` on the table `PaymentTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_intent_id` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentTransaction" ADD COLUMN     "payment_intent_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_payment_intent_id_key" ON "PaymentTransaction"("payment_intent_id");
