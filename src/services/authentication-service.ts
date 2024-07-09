import { invalidCredentialsError } from "@/errors";
import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signInPost({ email, password }: { email: string; password: string }) {
  const user = await getUser(email);

  await validatePassword(password, user.password);

  const token = await createSession(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}

async function logInWithOauth({ name, email }: { name: string; email: string }) {
  const findUser = await userRepository.findUserByEmail(email);

  if (!findUser) {
    const createdUser = await userRepository.createUser({ name, email });
    const token = await createSession(createdUser.id);

    return {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
      token,
    };
  }

  const token = await createSession(findUser.id);

  return {
    user: {
      id: findUser.id,
      name: findUser.name,
      email: findUser.email,
    },
    token,
  };
}

async function getUser(email: string) {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw invalidCredentialsError();

  return user as GetUserParams;
}

async function createSession(userId: string) {
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
  id: string;
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
