import {
  createBill,
  deleteBill,
  getBills,
  getCategories,
  getResumeBills,
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
  .post("/:billId/paid", updateBills)
  .get("/infos/resume", getResumeBills);

export { billRouter };
