import { prisma } from "@/config";
import { requestType } from "@prisma/client";

async function findFriendshipUserFriend({
  userId,
  friendId,
}: findFriendshipUserFriendParams) {
  return await prisma.friendship.findFirst({
    where: {
      userId,
      friendId,
    },
  });
}

type findFriendshipUserFriendParams = {
  userId: number;
  friendId: number;
};

async function createFriendRequest({ userId, friendId }) {
  return await prisma.friendship.create({
    data: {
      userId,
      friendId,
      requestStatus: requestType.PENDING,
    },
  });
}

async function getFriendRequestYouReceived(userId: number) {
  return await prisma.friendship.findMany({
    where: {
      friendId: userId,
      requestStatus: requestType.PENDING,
    },
    select: {
      users_friendship_userIdTousers: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

const friendshipRepository = {
  findFriendshipUserFriend,
  createFriendRequest,
  getFriendRequestYouReceived,
};

export default friendshipRepository;
