import { AuthenticatedRequest } from "@/middlewares";
import friendshipService from "@/services/friendship-service";
import searchService from "@/services/search-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function search(req: AuthenticatedRequest, res: Response) {
  const { email } = req.params as Record<string, string>;

  const result = await searchService.findEmail(email);
  return res.status(httpStatus.OK).send(result);
}

export async function searchFriends(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { email } = req.params as Record<string, string>;

  const friendsList = await friendshipService.getYourFriendsList(userId);

  const filteredList = friendsList.filter((friend) => friend.email.includes(email));

  return res.status(httpStatus.OK).send(filteredList);
}
