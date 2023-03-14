-- CreateTable
CREATE TABLE "PromoProducts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "PromoProducts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PromoProducts" ADD CONSTRAINT "PromoProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
