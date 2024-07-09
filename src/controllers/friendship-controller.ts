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

export async function getYourFriendRequests(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const result = await friendshipService.receivedFriendRequestOfUser(userId);

  return res.status(httpStatus.OK).send(result);
}

export async function getYourSendedFriendRequests(
  req: AuthenticatedRequest,
  res: Response
) {
  const { userId } = req;

  const result = await friendshipService.sendedFriendRequestOfUser(userId);
  return res.status(httpStatus.OK).send(result);
}

export async function acceptOrRejectFriendRequests(
  req: AuthenticatedRequest,
  res: Response
) {
  const { userId } = req;
  const { friendRequestId, requestStatus } = req.body;

  const result = await friendshipService.acceptOrRejectFriendRequest({
    userId,
    friendRequestId,
    requestStatus,
  });
  return res.status(httpStatus.OK).send(result);
}

export async function deleteSendedFriendRequests(
  req: AuthenticatedRequest,
  res: Response
) {
  const { userId } = req;
  const { friendRequestId } = req.params;
  const idFriendR = friendRequestId;

  await friendshipService.deleteSendedFriendRequest({ userId, idFriendR });
  return res.sendStatus(httpStatus.OK);
}

export async function getFriendsList(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const result = await friendshipService.getYourFriendsList(userId);
  return res.status(httpStatus.OK).send(result);
}
