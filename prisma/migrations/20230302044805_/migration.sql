/*
  Warnings:

  - A unique constraint covering the columns `[productId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_productId_userId_key" ON "Like"("productId", "userId");
