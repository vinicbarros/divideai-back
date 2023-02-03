import { conflictError, notFoundError } from "@/errors";
import { badRequestError } from "@/errors/bad-request-error";
import friendshipRepository from "@/repositories/friendship-repository";
import userRepository from "@/repositories/user-repository";
import { requestType } from "@prisma/client";

async function sendFriendRequestPost({
  userId,
  friendId,
}: {
  userId: number;
  friendId: number;
}) {
  if (isNaN(friendId) || friendId < 1 || friendId === userId) throw badRequestError();
  await checkUserById(friendId);

  const requestExist = await friendshipRepository.findFriendshipUserFriend({
    userId,
    friendId,
  });
  if (requestExist) throw conflictError("Friend request already exist");

  const result = await friendshipRepository.createFriendRequest({
    userId,
    friendId,
  });

  return {
    id: result.id,
  };
}

async function receivedFriendRequestOfUser(userId: number) {
  const result = await friendshipRepository.getPendingFriendRequestYouReceived(userId);

  const friends: FriendList[] = [];
  result.forEach((user, index) => {
    friends.push(user.users_friendship_userIdTousers);
    friends[index].friendRequestId = user.id;
  });

  return friends;
}

async function sendedFriendRequestOfUser(userId: number) {
  const result = await friendshipRepository.getPendingFriendRequestYouSended(userId);

  const friends: FriendList[] = [];
  result.forEach((user, index) => {
    friends.push(user.users_friendship_friendIdTousers);
    friends[index].friendRequestId = user.id;
  });

  return friends;
}

async function acceptOrRejectFriendRequest({
  userId,
  friendRequestId,
  requestStatus,
}: updateFriendRequestType) {
  if (isNaN(friendRequestId) || friendRequestId < 1) throw badRequestError();

  const friendRequest = await friendshipRepository.getFriendRequestById(friendRequestId);
  if (!friendRequest) throw notFoundError();

  if (friendRequest.friendId !== userId)
    throw conflictError("You don't have access to this friend request!");

  const updatedFriendRequest = await friendshipRepository.updateFriendRequest({
    friendRequestId,
    requestStatus,
  });

  return {
    id: updatedFriendRequest.id,
    requestStatus: updatedFriendRequest.requestStatus,
  };
}

async function deleteSendedFriendRequest({
  userId,
  idFriendR,
}: {
  userId: number;
  idFriendR: number;
}) {
  if (isNaN(idFriendR) || idFriendR < 1) throw badRequestError();

  const friendRequest = await friendshipRepository.getFriendRequestById(idFriendR);
  if (!friendRequest) throw notFoundError();

  if (friendRequest.userId !== userId && friendRequest.friendId !== userId)
    throw conflictError("You don't have access to delete this friend request!");

  const deletedFriendRequest = friendshipRepository.deleteFriendRequest(idFriendR);

  return deletedFriendRequest;
}

async function getYourFriendsList(userId: number) {
  const acceptedSendedRequests =
    await friendshipRepository.getAcceptedFriendRequestYouSended(userId);
  const acceptedReceivedRequests =
    await friendshipRepository.getAcceptedFriendRequestYouReceived(userId);
  const friendsReceived: FriendList[] = [];
  const friendsSended: FriendList[] = [];
  acceptedReceivedRequests.forEach((user, index) => {
    friendsReceived.push(user.users_friendship_userIdTousers);
    friendsReceived[index].friendRequestId = user.id;
  });
  acceptedSendedRequests.forEach((user, index) => {
    friendsSended.push(user.users_friendship_friendIdTousers);
    friendsSended[index].friendRequestId = user.id;
  });

  return [...friendsReceived, ...friendsSended];
}

async function checkUserById(id: number) {
  const userExist = await userRepository.findUserById(id);
  if (!userExist) throw notFoundError();

  return userExist;
}

const friendshipService = {
  sendFriendRequestPost,
  receivedFriendRequestOfUser,
  sendedFriendRequestOfUser,
  acceptOrRejectFriendRequest,
  deleteSendedFriendRequest,
  getYourFriendsList,
};

type updateFriendRequestType = {
  userId: number;
  friendRequestId: number;
  requestStatus: requestType;
};

type FriendList = {
  id: number;
  friendRequestId?: number;
  name: string;
  email: string;
};

export default friendshipService;
