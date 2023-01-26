import { search } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { searchSchemaBody } from "@/schemas/search-schema";
import { Router } from "express";

const searchRouter = Router();

searchRouter
  .use("/*", authenticateToken)
  .get("/", validateBody(searchSchemaBody), search);

export { searchRouter };
