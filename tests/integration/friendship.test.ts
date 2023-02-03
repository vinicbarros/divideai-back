import app, { close, init } from "@/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import {
  createAcceptedFriendRequest,
  createFriendRequest,
  createUser,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import { requestType } from "@prisma/client";

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

describe("POST /friend/send", () => {
  it("should respond with status 401 if no token is no given", async () => {
    const response = await server.post("/friend/send");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .post("/friend/send")
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
      .post("/friend/send")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if the friendId isn't valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = { friendId: 0 };

      const response = await server
        .post("/friend/send")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 if the friendId doesn't exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = { friendId: 1 };

      const response = await server
        .post("/friend/send")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 400 if the friendId is equal to userId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = { friendId: user.id };

      const response = await server
        .post("/friend/send")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 409 if the friend request is already created", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const friend = await createUser();
      const body = {
        userId: user.id,
        friendId: friend.id,
      };
      await createFriendRequest(body);

      const response = await server
        .post("/friend/send")
        .set("Authorization", `Bearer ${token}`)
        .send({
          friendId: friend.id,
        });

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 201 if the friend request is sended", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const friend = await createUser();

      const response = await server
        .post("/friend/send")
        .set("Authorization", `Bearer ${token}`)
        .send({
          friendId: friend.id,
        });
      expect(response.status).toBe(httpStatus.CREATED);
    });
  });
});

describe("GET /friend/send", () => {
  it("should respond with status 401 if no token is no given", async () => {
    const response = await server.get("/friend/send");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .get("/friend/send")
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
      .get("/friend/send")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 and an empty array if you don't sended any friend requests", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .get("/friend/send")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and an array of your sended friends requests", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const friend = await createUser();

      const body = {
        userId: user.id,
        friendId: friend.id,
      };

      const friendRequest = await createFriendRequest(body);

      const response = await server
        .get("/friend/send")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          friendRequestId: friendRequest.id,
          id: friend.id,
          name: friend.name,
          email: friend.email,
        },
      ]);
    });
  });
});

describe("GET /friend/request", () => {
  it("should respond with status 401 if no token is no given", async () => {
    const response = await server.get("/friend/request");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .get("/friend/request")
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
      .get("/friend/request")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 and an empty array if there is no friend requests", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .get("/friend/request")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and an array of friends requests", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const friend = await createUser();

      const body = {
        userId: friend.id,
        friendId: user.id,
      };

      const friendRequest = await createFriendRequest(body);

      const response = await server
        .get("/friend/request")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          friendRequestId: friendRequest.id,
          id: friend.id,
          name: friend.name,
          email: friend.email,
        },
      ]);
    });
  });
});

describe("PUT /friend/send", () => {
  it("should respond with status 401 if no token is no given", async () => {
    const response = await server.put("/friend/send");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .put("/friend/send")
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
      .put("/friend/send")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if the friend request id isn't valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = { friendRequestId: -50, requestStatus: requestType.ACCEPTED };

      const response = await server
        .put("/friend/send")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 if the requestStatus isn't valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = { friendRequestId: 0, requestStatus: faker.lorem.word() };

      const response = await server
        .put("/friend/send")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 if the friend request id doesn't exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = { friendRequestId: 1, requestStatus: requestType.ACCEPTED };

      const response = await server
        .put("/friend/send")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    describe("when body is valid", () => {
      it("should respond with status 409 if the friendId isn't equal to userId passed by auth", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const anotherUser = await createUser();
        const friend = await createUser();

        const friendRequest = await createFriendRequest({
          userId: friend.id,
          friendId: anotherUser.id,
        });

        const body = {
          friendRequestId: friendRequest.id,
          requestStatus: requestType.ACCEPTED,
        };

        const response = await server
          .put("/friend/send")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.CONFLICT);
      });

      it("should respond with status 200 and requestType ACCEPTED", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const friend = await createUser();

        const friendRequest = await createFriendRequest({
          userId: friend.id,
          friendId: user.id,
        });

        const body = {
          friendRequestId: friendRequest.id,
          requestStatus: requestType.ACCEPTED,
        };

        const response = await server
          .put("/friend/send")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: friendRequest.id,
          requestStatus: requestType.ACCEPTED,
        });
      });

      it("should respond with status 200 and requestType REJECTED", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const friend = await createUser();

        const friendRequest = await createFriendRequest({
          userId: friend.id,
          friendId: user.id,
        });

        const body = {
          friendRequestId: friendRequest.id,
          requestStatus: requestType.REJECTED,
        };

        const response = await server
          .put("/friend/send")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: friendRequest.id,
          requestStatus: requestType.REJECTED,
        });
      });
    });
  });
});

describe("DEL /friend/send", () => {
  it("should respond with status 401 if no token is no given", async () => {
    const response = await server.delete("/friend/delete");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .delete("/friend/delete")
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
      .delete("/friend/delete")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if the friend request id isn't valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .delete(`/friend/delete/${0}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 if the friend request id doesn't exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .delete(`/friend/delete/${1}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    describe("when body is valid", () => {
      it("should respond with status 409 if the userId isn't equal to userId passed by auth", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const anotherUser = await createUser();
        const friend = await createUser();

        const friendRequest = await createFriendRequest({
          userId: anotherUser.id,
          friendId: friend.id,
        });

        const response = await server
          .delete(`/friend/delete/${friendRequest.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.CONFLICT);
      });

      it("should respond with status 200 when friendRequest is deleted", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const friend = await createUser();

        const friendRequest = await createFriendRequest({
          userId: user.id,
          friendId: friend.id,
        });

        const response = await server
          .delete(`/friend/delete/${friendRequest.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
      });
    });
  });
});

describe("GET /friend", () => {
  it("should respond with status 401 if no token is no given", async () => {
    const response = await server.get("/friend");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/friend").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET as string
    );

    const response = await server.get("/friend").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 and an empty array if you don't any friend", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .get("/friend")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and an array of your friends list", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const friend = await createUser();

      const body = {
        userId: user.id,
        friendId: friend.id,
      };

      const friendRequest = await createAcceptedFriendRequest(body);

      const response = await server
        .get("/friend")
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
