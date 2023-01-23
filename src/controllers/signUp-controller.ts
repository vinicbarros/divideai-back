import signUpService from "@/services/signUp-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function signUp(req: Request, res: Response) {
  const { email, password, name } = req.body;

  const userCreated = await signUpService.createUser({
    email,
    password,
    name,
  });

  return res.status(httpStatus.CREATED).send({
    id: userCreated.id,
    email: userCreated.email,
  });
}
