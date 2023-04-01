/*
  Warnings:

  - You are about to drop the column `sessionId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "sessionId" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "sessionId";
