import { AuthenticatedRequest } from "@/middlewares";
import billService from "@/services/bill-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function createBill(req: AuthenticatedRequest, res: Response) {
  const { name, value, categoryId, billStatus, expireDate, usersBill } = req.body;

  const result = await billService.postNewBill({
    name,
    value,
    categoryId,
    billStatus,
    expireDate,
    usersBill,
  });

  return res.status(httpStatus.CREATED).send(result);
}

export async function getShortBills(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const result = await billService.getResumeBills(userId);
  return res.status(httpStatus.OK).send(result);
}
