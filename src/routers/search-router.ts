import { search, searchFriends } from "@/controllers";
import { authenticateToken, validateParams } from "@/middlewares";
import { searchSchemaBody } from "@/schemas/search-schema";
import { Router } from "express";

const searchRouter = Router();

searchRouter
  .use("/*", authenticateToken)
  .get("/:email", validateParams(searchSchemaBody), search)
  .get("/friends/:email", validateParams(searchSchemaBody), searchFriends);

export { searchRouter };
