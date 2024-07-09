import { prisma } from "@/config";

async function create({ token, userId }: { token: string; userId: string }) {
  return prisma.session.create({
    data: {
      token,
      userId,
    },
  });
}

const sessionRepository = {
  create,
};

export default sessionRepository;
