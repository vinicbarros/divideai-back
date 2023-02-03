import app, { close, init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import { createAcceptedFriendRequest, createUser } from "../factories";
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

describe("GET /search/:email", () => {
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
    describe("when body is valid", () => {
      it("should respond with status 200 and an empty array result", async () => {
        const token = await generateValidToken();

        const response = await server
          .get(`/search/${faker.lorem.word()}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
      });

      it("should respond with status 200 and result search", async () => {
        const token = await generateValidToken();
        const user = await createUser();

        const response = await server
          .get(`/search/${user.email}`)
          .set("Authorization", `Bearer ${token}`);

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

describe("GET /search/friends/:email", () => {
  it("should respond with status 401 if no token is no given", async () => {
    const response = await server.get("/search/friend");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .get("/search/friend")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET as string
    );

    const response = await server
      .get("/search/friend")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    describe("when body is valid", () => {
      it("should respond with status 200 and an empty array result", async () => {
        const token = await generateValidToken();

        const response = await server
          .get(`/search/friends/${faker.lorem.word()}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
      });

      it("should respond with status 200 and result search", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const friend = await createUser();

        const friendRequest = await createAcceptedFriendRequest({
          userId: user.id,
          friendId: friend.id,
        });
        const response = await server
          .get(`/search/friends/${friend.email}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([
          {
            id: friend.id,
            friendRequestId: friendRequest.id,
            name: friend.name,
            email: friend.email,
          },
        ]);
      });
    });
  });
});
