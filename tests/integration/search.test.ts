import app, { close, init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import { createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { faker } from "@faker-js/faker";

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

describe("GET /search", () => {
  it("should respond with status 401 if no token is no given", async () => {
    const response = await server.get("/search");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/search").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET as string
    );

    const response = await server.get("/search").set("Authorization", `Bearer ${token}`);

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
      it("should respond with status 200 and an empty array result", async () => {
        const token = await generateValidToken();
        const validBody = { email: faker.lorem.word() };

        const response = await server
          .get("/search")
          .set("Authorization", `Bearer ${token}`)
          .send(validBody);

        expect(response.status).toBe(httpStatus.OK);
      });

      it("should respond with status 200 and result search", async () => {
        const token = await generateValidToken();
        const user = await createUser();
        const validBody = { email: user.email };

        const response = await server
          .get("/search")
          .set("Authorization", `Bearer ${token}`)
          .send(validBody);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([
          {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        ]);
      });
    });
  });
});
