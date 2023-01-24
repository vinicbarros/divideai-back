import { SignInParams } from "@/protocols";
import Joi from "joi";

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const logInOauthSchema = Joi.object<logInOauthSchema>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

type logInOauthSchema = {
  name: string;
  email: string;
};
