import app, { close, init } from "@/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import {
  createBill,
  createCategory,
  createUser,
  createUsersBill,
  generateValidBillBody,
} from "../factories";
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

//essa rota pega as contas de forma resumida (sem as pessoas que estão nela)
describe("GET /bill", () => {
  it("should respond with status 401 if no token is no given", async () => {
    const response = await server.get("/bill");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/bill").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET as string
    );

    const response = await server.get("/bill").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 and an empty array if you don't have any bill", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/bill").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and a bill array", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const category = await createCategory();
      const bill = await createBill(category.id);
      const data = {
        billId: bill.id,
        userId: user.id,
      };
      await createUsersBill(data);

      const response = await server.get("/bill").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          bill: {
            id: bill.id,
            name: bill.name,
            value: bill.value,
            createdAt: bill.createdAt.toISOString(),
            category: {
              name: category.name,
            },
            _count: {
              userBill: 1,
            },
          },
        },
      ]);
    });
  });
});

//essa rota CRIA uma conta e também a relação de users bill
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

//essa rota pega uma unica conta com as informações adicionais
describe("GET /bill/:billId", () => {
  it("should respond with status 401 if no token is no given", async () => {
    const response = await server.get("/bill/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/bill/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET as string
    );

    const response = await server.get("/bill/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if billId param is not valid", async () => {
      const token = await generateValidToken();

      const response = await server
        .get("/bill/b")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 if bill doesn't exist", async () => {
      const token = await generateValidToken();

      const response = await server
        .get(`/bill/${faker.datatype.number()}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    describe("when param is valid", () => {
      it("should respond with status 401 if the userId is not related to the bill", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const category = await createCategory();
        const bill = await createBill(category.id);
        const anotherUser = await createUser();
        const data = {
          billId: bill.id,
          userId: anotherUser.id,
        };

        await createUsersBill(data);

        const response = await server
          .get(`/bill/${bill.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it("should respond with status 200 and bill data", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const category = await createCategory();
        const bill = await createBill(category.id);
        const data = {
          billId: bill.id,
          userId: user.id,
        };

        const userBill = await createUsersBill(data);

        const response = await server
          .get(`/bill/${bill.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: bill.id,
          name: bill.name,
          value: bill.value,
          expireDate: bill.expireDate.toISOString(),
          billStatus: bill.billStatus,
          category: {
            name: category.name,
          },
          userBill: [
            {
              value: userBill.value,
              paymentStatus: userBill.paymentStatus,
              users: {
                name: user.name,
                id: user.id,
              },
            },
          ],
        });
      });
    });
  });
});

//essa rota deleta uma conta
//describe("DEL /bill/:billId", () => {});

//essa rota atualiza o status de pagamento de cada usuario
//describe("POST /bill/:billId/paid", () => {});
