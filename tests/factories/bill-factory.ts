import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

export async function generateValidBillBody(categoryId?: number) {
  const billBody = {
    name: faker.lorem.word(),
    value: faker.datatype.number(),
    categoryId: categoryId || faker.datatype.number(),
    expireDate: dayjs().add(7, "day").toDate(),
    billStatus: "PENDING",
    usersBill: [{ userId: faker.datatype.number(), value: faker.datatype.number() }],
  };

  return billBody;
}

export async function createCategory() {
  return await prisma.category.create({
    data: {
      name: faker.lorem.word(),
    },
  });
}
