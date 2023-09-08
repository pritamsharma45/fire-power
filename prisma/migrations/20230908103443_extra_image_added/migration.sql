-- CreateTable
CREATE TABLE "ExtraImage" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "productId" INTEGER,

    CONSTRAINT "ExtraImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExtraImage" ADD CONSTRAINT "ExtraImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
