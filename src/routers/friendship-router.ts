import {
  acceptOrRejectFriendRequests,
  deleteSendedFriendRequests,
  getFriendsList,
  getYourFriendRequests,
  getYourSendedFriendRequests,
  sendFriendRequest,
} from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const friendshipRouter = Router();

friendshipRouter
  .all("/*", authenticateToken)
  .post("/send", sendFriendRequest)
  .get("/send", getYourSendedFriendRequests)
  .put("/send", acceptOrRejectFriendRequests)
  .delete("/send", deleteSendedFriendRequests)
  .get("/request", getYourFriendRequests)
  .get("/", getFriendsList);

export { friendshipRouter };
