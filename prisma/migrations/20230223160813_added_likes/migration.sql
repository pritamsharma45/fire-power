/*
  Warnings:

  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Like";
