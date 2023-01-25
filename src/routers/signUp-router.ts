import { signUp } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signUpSchema } from "@/schemas";
import { Router } from "express";

const signUpRouter = Router();

signUpRouter.post("/", validateBody(signUpSchema), signUp);

export { signUpRouter };
