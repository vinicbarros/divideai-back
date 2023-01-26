import { AuthenticatedRequest } from "@/middlewares";
import searchService from "@/services/search-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function search(req: AuthenticatedRequest, res: Response) {
  const { email } = req.body as Record<string, string>;

  const result = await searchService.findEmail(email);
  return res.status(httpStatus.OK).send(result);
}
