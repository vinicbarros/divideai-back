import { badRequestError, notFoundError, unauthorizedError } from "@/errors";
import { BillDataParams, UserListType } from "@/protocols";
import billRepository from "@/repositories/bill-repository";
import userRepository from "@/repositories/user-repository";
import { billType } from "@prisma/client";

async function postNewBill(billData: BillDataParams) {
  const category = await billRepository.findCategoryById(billData.categoryId);
  if (!category) throw notFoundError();

  const createdBill = await billRepository.create(billData);

  const data = {
    billId: createdBill.id,
    userList: billData.usersBill,
    billStatus: billData.billStatus,
  };

  await createUsersBill(data);

  return {
    id: createdBill.id,
  };
}

async function createUsersBill({
  billId,
  userList,
  billStatus,
}: {
  billId: string;
  userList: UserListType;
  billStatus: billType;
}) {
  const list = [...userList] as ListType;

  for (let i = 0; i < list.length; i++) {
    list[i].billId = billId;
    list[i].paymentStatus = billStatus;
    Reflect.deleteProperty(list[i], "name");
    const user = await userRepository.findUserById(list[i].userId);
    if (!user) throw badRequestError();
  }

  await billRepository.createUsersBill(list);
}

async function getResumeBills(userId: string) {
  const resume = await billRepository.findResumeUsersBill(userId);

  return resume;
}

async function getBill({ userId, billId }: { userId: string; billId: string }) {
  const bill = await billRepository.findBillById(billId);
  if (!bill) throw notFoundError();

  const userValid = await billRepository.findUserBillByUserIdAndBillId({
    userId,
    billId,
  });
  if (!userValid) throw unauthorizedError();

  const billDetails = await billRepository.findBillDetails(billId);

  return billDetails;
}

async function deleteBills({ userId, billId }: { userId: string; billId: string }) {
  const bill = await billRepository.findBillById(billId);
  if (!bill) throw notFoundError();
  if (bill.ownerId !== userId) throw unauthorizedError();

  const deletedBill = await billRepository.deleteBillAndUserBills(billId);

  return deletedBill;
}

async function payBills({ userId, billId }: { userId: string; billId: string }) {
  const bill = await billRepository.findBillById(billId);
  if (!bill) throw notFoundError();

  const userValid = await billRepository.findUserBillByUserIdAndBillId({
    userId,
    billId,
  });
  if (!userValid) throw unauthorizedError();

  const userBill = await billRepository.findUserBillByUserIdAndBillId({ userId, billId });
  const payBill = await billRepository.putUserBill(userBill.id);

  const usersBill = await billRepository.findUserBillByBillId(billId);
  const filteredBill = usersBill.filter(
    (bill) => bill.paymentStatus === billType.PENDING
  );
  if (filteredBill.length === 0) {
    await billRepository.updateBill(billId);
  }
  return payBill;
}

async function getCategory() {
  const categories = await billRepository.findCategories();

  return categories;
}

async function buildResume(userId: string) {
  const paidBills = await billRepository.countPaidBill(userId);
  const pendingBills = await billRepository.countPendingBill(userId);
  let totalPaid = 0;
  paidBills.forEach((bill) => {
    totalPaid += bill.value;
  });

  return {
    paidBills: paidBills.length,
    pendingBills: pendingBills.length,
    totalPaid: totalPaid,
  } as ResumeType;
}

type ListType = {
  userId: string;
  value: number;
  billId: string;
  paymentStatus: billType;
}[];

type ResumeType = {
  paidBills: number;
  pendingBills: number;
  totalPaid: number;
};

const billService = {
  postNewBill,
  getResumeBills,
  getBill,
  deleteBills,
  payBills,
  getCategory,
  buildResume,
};

export default billService;
