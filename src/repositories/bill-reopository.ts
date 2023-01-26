import { prisma } from "@/config";
import { BillDataParams } from "@/protocols";
import { billType } from "@prisma/client";

async function findCategoryById(id: number) {
  return prisma.category.findFirst({
    where: {
      id,
    },
  });
}

async function create(data: CreateBillParams) {
  return await prisma.bill.create({
    data: {
      name: data.name,
      value: data.value,
      expireDate: data.expireDate,
      categoryId: data.categoryId,
      billStatus: data.billStatus,
    },
  });
}

async function createUsersBill(data: UsersListParams) {
  return await prisma.userBill.createMany({
    data,
  });
}

async function findResumeUsersBill(userId: number) {
  return await prisma.userBill.findMany({
    where: {
      userId,
    },
    select: {
      bill: {
        select: {
          id: true,
          name: true,
          value: true,
          createdAt: true,
          category: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              userBill: true,
            },
          },
        },
      },
    },
  });
}

async function findBillById(id: number) {
  return await prisma.bill.findFirst({
    where: {
      id,
    },
  });
}

async function findUserBillByUserIdAndBillId({
  userId,
  billId,
}: {
  userId: number;
  billId: number;
}) {
  return await prisma.userBill.findFirst({
    where: {
      userId,
      billId,
    },
  });
}

async function findBillDetails(billId: number) {
  return prisma.bill.findFirst({
    where: {
      id: billId,
    },
    select: {
      id: true,
      name: true,
      value: true,
      expireDate: true,
      billStatus: true,
      category: {
        select: {
          name: true,
        },
      },
      userBill: {
        select: {
          value: true,
          paymentStatus: true,
          users: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
}

type CreateBillParams = Omit<BillDataParams, "usersBill">;

type UsersListParams = {
  billId: number;
  userId: number;
  value: number;
  paymentStatus: billType;
}[];

const billRepository = {
  findCategoryById,
  create,
  createUsersBill,
  findResumeUsersBill,
  findBillById,
  findUserBillByUserIdAndBillId,
  findBillDetails,
};

export default billRepository;
