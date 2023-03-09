import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const fakeImageIds = [
  "1vjtSVX8nUyIGeUWs4T32vCL375x3VtDt",
  "1q6M6GBR6yg2NurDspsIHyHsCOmDjS3k4",
  "1amCtlsneUfdBCAEAuyHp4pZ2RgV5EQqh",
  "1PNR6hvQePBzgSXXKFqtGOqjacDRXAVYQ",
  "1tqfH6rqLadYBDQZXuT04NZcMozojE9cj",
  "1jJkOQNhmJvsEOIrxz96mEcT6ueH-HXPN",
];

const data = Array.from({ length: 100 }).map((_, i) => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: 10.234,
    image: fakeImageIds[i % 6],
    stockQuantity: faker.datatype.number({
      min: 0,
      max: 10,
    }),
  };
});
const users = Array.from({ length: 100 }).map((_, i) => {
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
});

async function main() {
  // await prisma.like.deleteMany();
  // await prisma.comment.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.product.createMany({
  //   data,
  // });
  // await prisma.order.deleteMany();

  // await prisma.orderItem.deleteMany();
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
