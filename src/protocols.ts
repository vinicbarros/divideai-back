import { billType } from "@prisma/client";

export type ApplicationError = {
  name: string;
  message: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  name: string;
};

export type enrollmentParams = {
  userId: number;
  name: string;
  profileImage: string | undefined;
};

export type BillDataParams = {
  name: string;
  value: number;
  categoryId: number;
  expireDate: Date;
  billStatus: billType;
  usersBill: {
    userId: number;
    value: number;
  }[];
};

export type UserListType = {
  userId: number;
  value: number;
}[];

export type SignInParams = Omit<SignUpParams, "name">;

export type SignOauthParams = Omit<SignUpParams, "password">;
