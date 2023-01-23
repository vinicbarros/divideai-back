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

export type SignOauthParams = Omit<SignUpParams, "password">;
