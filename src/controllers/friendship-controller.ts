import { AuthenticatedRequest } from "@/middlewares";
import friendshipService from "@/services/friendship-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function sendFriendRequest(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { friendId } = req.body;

  await friendshipService.sendFriendRequestPost({ userId, friendId });
  return res.sendStatus(httpStatus.CREATED);
}

export async function getYourFriendsRequests(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const result = await friendshipService.receivedFriendRequestOfUser(userId);
  return res.status(httpStatus.OK).send(result);
}
