import app, { close, init } from "@/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createCategory, createUser, generateValidBillBody } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import dayjs from "dayjs";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await cleanDb();
  await close();
});

const server = supertest(app);

//describe("GET /bill", () => {});

describe("POST /bill", () => {
  it("should respond with status 401 if no token is no given", async () => {
    const response = await server.post("/bill");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/bill").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET as string
    );

    const response = await server.post("/bill").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .post("/bill")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("should respond with status 404 if the categoryId doesn't exist", async () => {
        const token = await generateValidToken();
        const body = await generateValidBillBody();

        const response = await server
          .post("/bill")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
      it("should respond with status 400 if the usersBillArray isn't valid", async () => {
        const token = await generateValidToken();
        const category = await createCategory();
        const body = await generateValidBillBody(category.id);

        const response = await server
          .post("/bill")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it("should respond with status 201 and created bill data", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const friend = await createUser();
        const category = await createCategory();

        const body = {
          name: faker.lorem.word(),
          value: faker.datatype.number({ min: 10, max: 50 }),
          categoryId: category.id,
          expireDate: dayjs().add(7, "day").toDate(),
          billStatus: "PENDING",
          usersBill: [
            { userId: friend.id, value: faker.datatype.number({ min: 10, max: 50 }) },
          ],
        };

        const response = await server
          .post("/bill")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.CREATED);
      });
    });
  });
});

//describe("GET /bill/:billId", () => {});

//describe("DEL /bill/:billId", () => {});

//describe("POST /bill/:billId/paid", () => {});
