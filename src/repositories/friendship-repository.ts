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
  userId: string;
  friendId: string;
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

async function getPendingFriendRequestYouReceived(userId: string) {
  return await prisma.friendship.findMany({
    where: {
      friendId: userId,
      requestStatus: requestType.PENDING,
    },
    select: {
      id: true,
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

async function getPendingFriendRequestYouSended(userId: string) {
  return await prisma.friendship.findMany({
    where: {
      userId: userId,
      requestStatus: requestType.PENDING,
    },
    select: {
      id: true,
      users_friendship_friendIdTousers: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

async function getFriendRequestById(id: string) {
  return await prisma.friendship.findFirst({
    where: {
      id,
    },
  });
}

async function updateFriendRequest({
  friendRequestId,
  requestStatus,
}: updateFriendRequestType) {
  return await prisma.friendship.update({
    where: {
      id: friendRequestId,
    },
    data: {
      requestStatus,
    },
  });
}

async function deleteFriendRequest(friendRequestId: string) {
  return await prisma.friendship.delete({
    where: {
      id: friendRequestId,
    },
  });
}

async function getAcceptedFriendRequestYouReceived(userId: string) {
  return await prisma.friendship.findMany({
    where: {
      friendId: userId,
      requestStatus: requestType.ACCEPTED,
    },
    select: {
      id: true,
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

async function getAcceptedFriendRequestYouSended(userId: string) {
  return await prisma.friendship.findMany({
    where: {
      userId: userId,
      requestStatus: requestType.ACCEPTED,
    },
    select: {
      id: true,
      users_friendship_friendIdTousers: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

type updateFriendRequestType = {
  friendRequestId: string;
  requestStatus: requestType;
};

const friendshipRepository = {
  findFriendshipUserFriend,
  createFriendRequest,
  getPendingFriendRequestYouReceived,
  getPendingFriendRequestYouSended,
  getFriendRequestById,
  updateFriendRequest,
  deleteFriendRequest,
  getAcceptedFriendRequestYouReceived,
  getAcceptedFriendRequestYouSended,
};

export default friendshipRepository;
