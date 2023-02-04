import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const data = [
  { name: "Viagem" },
  { name: "Casa" },
  { name: "Evento" },
  { name: "Projeto" },
  { name: "Investimento" },
  { name: "Churrasco" },
  { name: "Rolê" },
  { name: "Outro" },
];

async function main() {
  let categories = await prisma.category.findMany();
  if (categories.length === 0) {
    await prisma.category.createMany({
      data,
    });
  }

  console.log({ data });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
