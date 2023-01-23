import { prisma } from "@/config";

async function createUser({
  name,
  password,
  email,
}: {
  name: string;
  password: string;
  email: string;
}) {
  return await prisma.users.create({
    data: {
      email,
      password,
      name,
    },
  });
}

async function findUserByEmail(email: string) {
  return await prisma.users.findFirst({
    where: {
      email,
    },
  });
}

const userRepository = {
  createUser,
  findUserByEmail,
};

export default userRepository;
