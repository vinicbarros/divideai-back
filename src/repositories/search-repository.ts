import { prisma } from "@/config";

async function searchByEmail(email: string) {
  return await prisma.users.findMany({
    where: {
      email: {
        contains: email,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

const searchRepository = {
  searchByEmail,
};

export default searchRepository;
