import { prisma } from "@/config";
import { friendship, requestType } from "@prisma/client";

export async function createFriendRequest({
  userId,
  friendId,
}: FriendRequestType): Promise<friendship> {
  return prisma.friendship.create({
    data: {
      userId: userId,
      friendId: friendId,
      requestStatus: requestType.PENDING,
    },
  });
}

export async function createAcceptedFriendRequest({
  userId,
  friendId,
}: FriendRequestType): Promise<friendship> {
  return prisma.friendship.create({
    data: {
      userId: userId,
      friendId: friendId,
      requestStatus: requestType.ACCEPTED,
    },
  });
}

type FriendRequestType = {
  userId: number;
  friendId: number;
};
