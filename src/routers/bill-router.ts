import { createBill } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { billSchema } from "@/schemas/bill-schema";
import { Router } from "express";

const billRouter = Router();

billRouter.all("/*", authenticateToken).post("/", validateBody(billSchema), createBill);

export { billRouter };
