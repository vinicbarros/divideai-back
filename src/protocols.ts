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
  userId: string;
  name: string;
  profileImage: string | undefined;
};

export type BillDataParams = {
  name: string;
  value: number;
  pixKey: string;
  categoryId: string;
  ownerId: string;
  expireDate: Date;
  billStatus: billType;
  usersBill: {
    userId: string;
    value: number;
  }[];
};

export type UserListType = {
  userId: string;
  value: number;
}[];

export type SignInParams = Omit<SignUpParams, "name">;

export type SignOauthParams = Omit<SignUpParams, "password">;
