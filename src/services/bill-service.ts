import { badRequestError, notFoundError } from "@/errors";
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

type ListType = {
  userId: number;
  value: number;
  billId: number;
  paymentStatus: billType;
}[];

const billService = {
  postNewBill,
};

export default billService;
