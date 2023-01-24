import { invalidCredentialsError } from "@/errors";
import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import { exclude } from "@/utils/prisma-utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signInPost({ email, password }: { email: string; password: string }) {
  const user = await getUser(email);

  await validatePassword(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, "password"),
    token,
  };
}

async function logInWithOauth({ name, email }: { name: string; email: string }) {
  const findUser = await userRepository.findUserByEmail(email);

  if (!findUser) {
    const createdUser = await userRepository.createUser({ name, email });
    const token = await createSession(createdUser.id);

    return {
      user: exclude(createdUser, "password"),
      token,
    };
  }

  const token = await createSession(findUser.id);

  return {
    user: exclude(findUser, "password"),
    token,
  };
}

async function getUser(email: string) {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw invalidCredentialsError();

  return user as GetUserParams;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePassword(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

type GetUserParams = {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
};

const authenticationService = {
  signInPost,
  logInWithOauth,
};

export default authenticationService;
