import { SignOauthParams, SignUpParams } from "@/protocols";
import Joi from "joi";

export const signUpSchema = Joi.object<SignUpParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
});

export const signOauthSchema = Joi.object<SignOauthParams>({
  email: Joi.string().email().required(),
});
