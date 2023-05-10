/*
  Warnings:

  - Made the column `allergies` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "allergies" SET NOT NULL,
ALTER COLUMN "allergies" SET DEFAULT 'None';
