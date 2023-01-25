import { conflictError, notFoundError } from "@/errors";
import { badRequestError } from "@/errors/bad-request-error";
import friendshipRepository from "@/repositories/friendship-repository";
import userRepository from "@/repositories/user-repository";

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
  const result = await friendshipRepository.getFriendRequestYouReceived(userId);
  const usersArr = [];

  result.forEach((user) => {
    usersArr.push(user.users_friendship_userIdTousers);
  });
  return usersArr;
}

async function checkUserById(id: number) {
  const userExist = await userRepository.findUserById(id);
  if (!userExist) throw notFoundError();

  return userExist;
}

const friendshipService = {
  sendFriendRequestPost,
  receivedFriendRequestOfUser,
};

export default friendshipService;
