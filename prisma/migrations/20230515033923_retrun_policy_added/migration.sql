-- CreateEnum
CREATE TYPE "ReturnWarranty" AS ENUM ('NO_RETURN_NO_WARRANTY', 'NONE', 'NO_RETURN', 'NO_WARRANTY', 'RETURN_WARRANTY');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "policyType" "ReturnWarranty" DEFAULT 'NO_RETURN_NO_WARRANTY';
