import { badRequestError, notFoundError, unauthorizedError } from "@/errors";
import { BillDataParams, UserListType } from "@/protocols";
import billRepository from "@/repositories/bill-reopository";
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
  billId: number;
  userList: UserListType;
  billStatus: billType;
}) {
  const list = [...userList] as ListType;
  for (let i = 0; i < list.length; i++) {
    list[i].billId = billId;
    list[i].paymentStatus = billStatus;

    const user = await userRepository.findUserById(list[i].userId);
    if (!user) throw badRequestError();
  }

  await billRepository.createUsersBill(list);
}

async function getResumeBills(userId: number) {
  const resume = await billRepository.findResumeUsersBill(userId);

  return resume;
}

async function getBill({ userId, billId }: { userId: number; billId: number }) {
  if (isNaN(billId) || billId < 1) throw badRequestError();

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

async function deleteBills({ userId, billId }: { userId: number; billId: number }) {
  if (isNaN(billId) || billId < 1) throw badRequestError();

  const bill = await billRepository.findBillById(billId);
  if (!bill) throw notFoundError();
  if (bill.ownerId !== userId) throw unauthorizedError();

  const deletedBill = await billRepository.deleteBillAndUserBills(billId);

  return deletedBill;
}

async function payBills({ userId, billId }: { userId: number; billId: number }) {
  if (isNaN(billId) || billId < 1) throw badRequestError();

  const bill = await billRepository.findBillById(billId);
  if (!bill) throw notFoundError();

  const userValid = await billRepository.findUserBillByUserIdAndBillId({
    userId,
    billId,
  });
  if (!userValid) throw unauthorizedError();

  const userBill = await billRepository.findUserBillByUserIdAndBillId({ userId, billId });
  const payBill = await billRepository.putUserBill(userBill.id);

  return payBill;
}

type ListType = {
  userId: number;
  value: number;
  billId: number;
  paymentStatus: billType;
}[];

const billService = {
  postNewBill,
  getResumeBills,
  getBill,
  deleteBills,
  payBills,
};

export default billService;
