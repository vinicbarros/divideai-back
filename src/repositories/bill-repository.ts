import { prisma } from "@/config";
import { BillDataParams } from "@/protocols";
import { billType } from "@prisma/client";

async function findCategoryById(id: string) {
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
      pixKey: data.pixKey,
      expireDate: data.expireDate,
      categoryId: data.categoryId,
      ownerId: data.ownerId,
      billStatus: data.billStatus,
    },
  });
}

async function createUsersBill(data: UsersListParams) {
  return await prisma.userBill.createMany({
    data,
  });
}

async function findResumeUsersBill(userId: string) {
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
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
}

async function findBillById(id: string) {
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
  userId: string;
  billId: string;
}) {
  return await prisma.userBill.findFirst({
    where: {
      userId,
      billId,
    },
  });
}

async function findUserBillByBillId(billId: string) {
  return await prisma.userBill.findMany({
    where: {
      billId,
    },
  });
}

async function findBillDetails(billId: string) {
  return prisma.bill.findFirst({
    where: {
      id: billId,
    },
    select: {
      id: true,
      name: true,
      value: true,
      pixKey: true,
      expireDate: true,
      ownerId: true,
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

async function deleteBillAndUserBills(billId: string) {
  return await prisma.$transaction([
    prisma.userBill.deleteMany({ where: { billId } }),
    prisma.bill.delete({ where: { id: billId } }),
  ]);
}

async function putUserBill(id: string) {
  return await prisma.userBill.update({
    where: {
      id,
    },
    data: {
      paymentStatus: billType.PAID,
    },
  });
}

async function findCategories() {
  return await prisma.category.findMany();
}

async function countPaidBill(userId: string) {
  return await prisma.userBill.findMany({
    where: {
      userId,
      paymentStatus: "PAID",
    },
  });
}

async function countPendingBill(userId: string) {
  return await prisma.userBill.findMany({
    where: {
      userId,
      paymentStatus: "PENDING",
    },
  });
}

async function updateBill(billId: string) {
  return await prisma.bill.update({
    where: {
      id: billId,
    },
    data: {
      billStatus: billType.PAID,
    },
  });
}

type CreateBillParams = Omit<BillDataParams, "usersBill">;

type UsersListParams = {
  billId: string;
  userId: string;
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
  findUserBillByBillId,
  findBillDetails,
  deleteBillAndUserBills,
  putUserBill,
  findCategories,
  countPaidBill,
  countPendingBill,
  updateBill,
};

export default billRepository;
