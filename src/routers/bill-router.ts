import {
  createBill,
  deleteBill,
  getBills,
  getCategories,
  getShortBills,
  updateBills,
} from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { billSchema } from "@/schemas/bill-schema";
import { Router } from "express";

const billRouter = Router();

billRouter
  .all("/*", authenticateToken)
  .post("/", validateBody(billSchema), createBill)
  .get("/", getShortBills)
  .get("/category/find", getCategories)
  .get("/:billId", getBills)
  .delete("/:billId", deleteBill)
  .post("/:billId/paid", updateBills);

export { billRouter };
