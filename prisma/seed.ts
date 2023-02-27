import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const fakeImageIds = [
  "1vjtSVX8nUyIGeUWs4T32vCL375x3VtDt",
  "1q6M6GBR6yg2NurDspsIHyHsCOmDjS3k4",
  "1amCtlsneUfdBCAEAuyHp4pZ2RgV5EQqh",
  "1qwi5ihxKpZqnoGeZtWSOw7noK7pGbFVt",
];

const data = Array.from({ length: 100 }).map((_, i) => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: 10.234,
    image: fakeImageIds[i % 3],
    stockQuantity: faker.datatype.number({
      min: 0,
      max: 10,
    }),
  };
});

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
