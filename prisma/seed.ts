import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const data = Array.from({ length: 100 }).map(() => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: 10.234,
    image: faker.image.imageUrl(),
  };
});

async function main() {
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
