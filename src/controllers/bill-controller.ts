import { AuthenticatedRequest } from "@/middlewares";
import billService from "@/services/bill-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function createBill(req: AuthenticatedRequest, res: Response) {
  const { name, value, pixKey, categoryId, billStatus, expireDate, usersBill } = req.body;
  const ownerId = req.userId;

  const result = await billService.postNewBill({
    name,
    value,
    pixKey,
    categoryId,
    billStatus,
    expireDate,
    usersBill,
    ownerId,
  });

  return res.status(httpStatus.CREATED).send(result);
}

export async function getShortBills(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const result = await billService.getResumeBills(userId);
  return res.status(httpStatus.OK).send(result);
}

export async function getBills(req: AuthenticatedRequest, res: Response) {
  const billId = Number(req.params.billId);
  const { userId } = req;

  const result = await billService.getBill({ userId, billId });

  return res.status(httpStatus.OK).send(result);
}

export async function deleteBill(req: AuthenticatedRequest, res: Response) {
  const billId = Number(req.params.billId);
  const { userId } = req;

  await billService.deleteBills({ userId, billId });

  return res.sendStatus(httpStatus.OK);
}

export async function updateBills(req: AuthenticatedRequest, res: Response) {
  const billId = Number(req.params.billId);
  const { userId } = req;

  await billService.payBills({ userId, billId });

  return res.sendStatus(httpStatus.OK);
}

export async function getCategories(req: AuthenticatedRequest, res: Response) {
  const result = await billService.getCategory();

  return res.status(httpStatus.OK).send(result);
}

export async function getResumeBills(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const result = await billService.buildResume(userId);

  return res.status(httpStatus.OK).send(result);
}
