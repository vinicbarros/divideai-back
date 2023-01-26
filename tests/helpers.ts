import { prisma } from "@/config";
import { users } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import { createSession, createUser } from "./factories";

export async function cleanDb() {
  await prisma.userBill.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.category.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.session.deleteMany();
  await prisma.users.deleteMany();
}

export async function generateValidToken(user?: users) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET as string);

  await createSession(token);

  return token;
}
