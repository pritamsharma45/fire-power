/*
  Warnings:

  - You are about to drop the column `payment_intent_id` on the `PaymentTransaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PaymentTransaction_payment_intent_id_key";

-- AlterTable
ALTER TABLE "PaymentTransaction" DROP COLUMN "payment_intent_id";
