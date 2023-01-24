import app, { close, init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb } from "../helpers";
import { faker } from "@faker-js/faker";
import { createUser } from "../factories";
import { duplicatedEmailError } from "@/errors";

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

describe("POST /signup", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/signup");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/signup").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(6),
      name: faker.name.firstName(),
    });

    it("should respond with status 409 when there is an user with given email", async () => {
      const body = generateValidBody();
      await createUser(body);

      const response = await server.post("/signup").send(body);
      expect(response.status).toBe(httpStatus.CONFLICT);
      expect(response.body).toEqual({
        message: duplicatedEmailError().message,
      });
    });

    it("should respond with status 201 and create user when given email is unique", async () => {
      const body = generateValidBody();

      const response = await server.post("/signup").send(body);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        email: body.email,
      });
    });

    it("should not return user password on body", async () => {
      const body = generateValidBody();

      const response = await server.post("/signup").send(body);

      expect(response.body).not.toHaveProperty("password");
    });
  });
});
