import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import { billType } from "@prisma/client";
import dayjs from "dayjs";

export async function generateValidBillBody(categoryId?: number) {
  const billBody = {
    name: faker.lorem.word(),
    value: faker.datatype.number(),
    categoryId: categoryId || faker.datatype.number(),
    expireDate: dayjs().add(7, "day").toDate(),
    billStatus: "PENDING",
    usersBill: [
      {
        userId: faker.datatype.number(),
        value: faker.datatype.number(),
        name: faker.name.firstName(),
      },
    ],
  };

  return billBody;
}

export async function createBill({
  categoryId,
  ownerId,
}: {
  categoryId: number;
  ownerId: number;
}) {
  return await prisma.bill.create({
    data: {
      name: faker.lorem.word(),
      value: faker.datatype.number(),
      categoryId: categoryId,
      ownerId: ownerId,
      billStatus: billType.PENDING,
      expireDate: dayjs().add(5, "day").toDate(),
    },
  });
}

export async function createUsersBill({
  userId,
  billId,
}: {
  userId: number;
  billId: number;
}) {
  return await prisma.userBill.create({
    data: {
      billId,
      userId,
      value: faker.datatype.number({ max: 50 }),
      paymentStatus: billType.PAID,
    },
  });
}

export async function createCategory() {
  return await prisma.category.create({
    data: {
      name: faker.lorem.word(),
    },
  });
}
