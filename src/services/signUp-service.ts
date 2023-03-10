import { duplicatedEmailError } from "@/errors";
import { SignUpParams } from "@/protocols";
import userRepository from "@/repositories/user-repository";
import bcrypt from "bcrypt";

export async function createUser({ email, password, name }: SignUpParams) {
  await validateEmail(email);
  const hashPassword = await bcrypt.hash(password, 12);

  return await userRepository.createUser({
    name,
    email,
    password: hashPassword,
  });
}

async function validateEmail(email: string) {
  const emailIsUsed = await userRepository.findUserByEmail(email);
  if (emailIsUsed) throw duplicatedEmailError();
}

const signUpService = {
  createUser,
};

export default signUpService;
