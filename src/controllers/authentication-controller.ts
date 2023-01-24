import authenticationService from "@/services/authentication-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;

  const createdUser = await authenticationService.signInPost({
    email,
    password,
  });

  return res.status(httpStatus.OK).send(createdUser);
}

export async function logInWithOauthPost(req: Request, res: Response) {
  const { name, email }: { name: string; email: string } = req.body;

  const result = await authenticationService.logInWithOauth({ name, email });

  return res.status(httpStatus.OK).send(result);
}
