import app, { close, init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb } from "../helpers";
import { faker } from "@faker-js/faker";
import { createOauthUser, createUser } from "../factories";

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

describe("POST /auth/sign-in", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/auth/sign-in");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/auth/sign-in").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });

    it("should respond with status 401 if there is no user for given email", async () => {
      const body = generateValidBody();

      const response = await server.post("/auth/sign-in").send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is a user for given email but password is not correct", async () => {
      const body = generateValidBody();
      await createUser(body);

      const response = await server.post("/auth/sign-in").send({
        ...body,
        password: faker.lorem.word(),
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when credentials are valid", () => {
      it("should respond with status 200", async () => {
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post("/auth/sign-in").send(body);

        expect(response.status).toBe(httpStatus.OK);
      });

      it("should respond with user data", async () => {
        const body = generateValidBody();
        const user = await createUser(body);

        const response = await server.post("/auth/sign-in").send(body);

        expect(response.body.user).toEqual({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt?.toISOString(),
        });
      });

      it("should respond with session token", async () => {
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post("/auth/sign-in").send(body);

        expect(response.body.token).toBeDefined();
      });
    });
  });
});

describe("POST /auth/oauth", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/auth/oauth");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/auth/oauth").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      name: faker.name.firstName(),
      email: faker.internet.email(),
    });
    it("should respond with status 200 and user info when login", async () => {
      const body = generateValidBody();
      const user = await createOauthUser(body);

      const response = await server.post("/auth/oauth").send(body);

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt?.toISOString(),
      });
    });

    it("should respond with status 200 and created user info when sign up", async () => {
      const body = generateValidBody();

      const response = await server.post("/auth/oauth").send(body);

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        createdAt: expect.any(String),
      });
    });

    it("should respond with status 200 and user token", async () => {
      const body = generateValidBody();
      await createOauthUser(body);

      const response = await server.post("/auth/oauth").send(body);

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });
});
