import { BillDataParams } from "@/protocols";
import Joi from "joi";

const userListSchema = Joi.object<UserListSchema>({
  userId: Joi.number().required(),
  value: Joi.number().required(),
  name: Joi.string().required(),
});

export const billSchema = Joi.object<BillDataParams>({
  name: Joi.string().required(),
  value: Joi.number().required(),
  pixKey: Joi.string().required(),
  categoryId: Joi.number().required(),
  billStatus: Joi.string().valid("PENDING", "PAID").required(),
  expireDate: Joi.date().required(),
  usersBill: Joi.array<UserListSchema>().items(userListSchema).required(),
});

type UserListSchema = {
  userId: number;
  value: number;
  name: string;
};
