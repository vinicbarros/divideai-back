import "express-async-errors";
import express, { Express, json } from "express";
import cors from "cors";

import { loadEnv, connectDb, disconnectDb } from "@/config";
import { signUpRouter } from "@/routers";
import { handleApplicationErrors } from "@/middlewares";

loadEnv();

const app = express();

app.use(cors());
app.use(json());
app.use("/signup", signUpRouter);
app.use(handleApplicationErrors);

export async function init(): Promise<Express> {
  await connectDb();
  return Promise.resolve(app);
}

export async function close() {
  await disconnectDb();
}

export default app;
