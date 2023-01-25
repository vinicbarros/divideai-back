import { getYourFriendsRequests, sendFriendRequest } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const friendshipRouter = Router();

friendshipRouter
  .all("/*", authenticateToken)
  .post("/send", sendFriendRequest)
  .get("/send")
  .put("/send")
  .delete("/send")
  .get("/request", getYourFriendsRequests);

export { friendshipRouter };
