import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fakeImageIds = [
  "1Xz-GuY6lzATy-PKg4-oJ7NDbeR2rsF2J",
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

const data = fakeImageIds.map((id) => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    allergies: faker.lorem.words(3),
    price: 16.234,
    image: id,
    stockQuantity: faker.datatype.number({
      min: 0,
      max: 10,
    }),
  };
});

type dataType = {
  title: string;
  description: string;
  allergies: string;
  price: number;
  image: string;
  stockQuantity: number;
  rank: number;
};

//  fetch data from api routes

const users = Array.from({ length: 100 }).map((_, i) => {
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
});

async function main() {
  const res = await fetch("http://localhost:3000/api/seedData");
  const data = await res.json();
  console.log(data);

  const defaultAlleries =
    "Please note that Love Joint does not offer any medical advice to its customers. We invite you to consult a doctor in order to have a professional opinion before using this product. Results may vary with each individual and we cannot guarantee its effects.  If you are already taking medication, have a specific health condition, are pregnant or have any other medical condition, please consult a healthcare practitioner before using this product.";
  const seedData: dataType = data.products.map((product) => {
    return {
      title:
        product.title === "" ? faker.commerce.productName() : product.title,
      description:
        product.description === ""
          ? faker.commerce.productDescription()
          : product.description,
      allergies: product.allergies === "" ? defaultAlleries : product.allergies,
      price:
        product.price === ""
          ? faker.datatype.number({
              min: 0,
              max: 100,
              precision: 0.01,
            })
          : Number(product.price),
      rank: product.rank === "" ? 2000 : Number(product.rank),

      image: product.image,
      stockQuantity:
        product.stockQuantity === ""
          ? faker.datatype.number({
              min: 0,
              max: 10,
            })
          : Number(product.stockQuantity),
    };
  });
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: seedData,
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
