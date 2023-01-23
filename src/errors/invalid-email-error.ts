import { ApplicationError } from "@/protocols";

export function invalidEmailError(email: string): ApplicationEmailError {
  return {
    name: "InvalidEmailError",
    email: email,
    message: `"${email}" is not a valid email!`,
  };
}

export function duplicatedEmailError(): ApplicationError {
  return {
    name: "DuplicatedEmailError",
    message: "There is already an user with given email",
  };
}

export type ApplicationEmailError = ApplicationError & { email: string };
