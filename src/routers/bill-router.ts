import { createBill, getBills, getShortBills } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { billSchema } from "@/schemas/bill-schema";
import { Router } from "express";

const billRouter = Router();

billRouter
  .all("/*", authenticateToken)
  .post("/", validateBody(billSchema), createBill)
  .get("/", getShortBills)
  .get("/:billId", getBills);

export { billRouter };
