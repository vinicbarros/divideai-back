import { prisma } from "@/config";

async function createUser({ name, email, password }: CreateUserParams) {
  return await prisma.users.create({
    data: {
      name,
      email,
      password,
    },
  });
}

type CreateUserParams = {
  name: string;
  email: string;
  password?: string;
};

async function findUserByEmail(email: string) {
  return await prisma.users.findFirst({
    where: {
      email,
    },
  });
}

async function findUserById(id: number) {
  return await prisma.users.findFirst({
    where: {
      id,
    },
  });
}

const userRepository = {
  createUser,
  findUserByEmail,
  findUserById,
};

export default userRepository;
