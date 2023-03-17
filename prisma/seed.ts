import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const fakeImageIds = [
  "17MkA8vOMiDJ1NZAzrO-zU0de9PNXTK6L",
  "1NMLd1mZfS7cIhc50U4P-3tITNgS-saXk",
  "14VTr0txyJXv3ZUdJ3d6BdOEvj8sKDY27",
  "15kc5No9vDkxdRbyGUrwmIHLO-KXG56Vl",
  "1VrBRnJh-_NsERvjnlmNLHX6pmJO8ENaW",
  "17QMsQ2DjO9UeSJZyWLv_ZRbtvGXLaElh",
  "10zChEgQ9Izy-JepqZ1Luh27I23J0FF6n",
  "1bG3pYNfwoeJIIm0cFloSV05sPZBPuZ5z",
  "1ynfFZs7uQyfkjWNxu-YlIYji5QUxqFJ0",
  "1LJrfD3kuMxG_RC-lRNzM81BzGhE_bciM",
  "1q6Ne_UHvwNhQqzIU0u7R8VyOxE3AKiV6",
  "12v5iN_iK_HFmc4Z4E0QUbfQDp-rBI8Yj",
  "1GnSyWZAggGNFVKJ3pycz7IW3zAxjbtSr",
  "1PNR6hvQePBzgSXXKFqtGOqjacDRXAVYQ",
  "1jJkOQNhmJvsEOIrxz96mEcT6ueH-HXPN",
  "1tqfH6rqLadYBDQZXuT04NZcMozojE9cj",
  "1amCtlsneUfdBCAEAuyHp4pZ2RgV5EQqh",
  "1q6M6GBR6yg2NurDspsIHyHsCOmDjS3k4",
  "1vjtSVX8nUyIGeUWs4T32vCL375x3VtDt",
];

const data = Array.from({ length: 100 }).map((_, i) => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: 10.234,
    image: fakeImageIds[i % 19],
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
   await prisma.profile.deleteMany();
  // await prisma.subscribers.deleteMany();
  // await prisma.like.deleteMany();
  // await prisma.comment.deleteMany();
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();

  // await prisma.user.deleteMany();
  // await prisma.paymentTransaction.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.product.createMany({
  //   data,
  // });
  // await prisma.cart.deleteMany();
  // await prisma.cart.create({
  //   data: {
  //     user: { connect: { id: "clf19jhui0006v8vx1eq2pmle" } },
  //     items: [
  //       {
  //         productId: 2,
  //         quantity: 2,
  //         price: 234
  //       }
  //     ]
  //   },
  // });
  // Get products with aggregated likes. Count likes and group by product id
  // let productsWithLikes = await prisma.product.findMany({
  //   select: {
  //     title: true,
  //     description: true,
  //     likes: {
  //       select: {
  //         hasLiked: true,
  //       },
  //     },
  //     _count: { select: { likes: { where: { hasLiked: true } } } },
  //   },

  // });

  // productsWithLikes =productsWithLikes.sort((a, b) => {
  //   return b._count.likes - a._count.likes;
  // }).slice(0, 10);
  // console.log(productsWithLikes.length);

  // console.log(productsWithLikes);
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
