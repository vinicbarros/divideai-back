import { BillDataParams, UserListType } from "@/protocols";
import Joi from "joi";

const userListSchema = Joi.object<UserListSchema>({
  userId: Joi.number().required(),
  value: Joi.number().required(),
});

export const billSchema = Joi.object<BillDataParams>({
  name: Joi.string().required(),
  value: Joi.number().required(),
  categoryId: Joi.number().required(),
  billStatus: Joi.string().valid("PENDING", "PAID").required(),
  expireDate: Joi.date().required(),
  usersBill: Joi.array<UserListType>().items(userListSchema).required(),
});

type UserListSchema = {
  userId: number;
  value: number;
};
