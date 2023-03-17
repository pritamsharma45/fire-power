/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dob_day` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob_month` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "dob_day" INTEGER NOT NULL,
ADD COLUMN     "dob_month" INTEGER NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");
