import { Request, Response } from "express";
import User, { UserType } from "../models/User";
import Chat from "../models/Chat";

const ChatResponses = {
  RECEIVER_REQUIRED: "Receiver and sender must be provided",
  USER_NOT_FOUND: "User not found",
  CHAT_RETRIEVED: "Chat retrieved successfully",
  CHATS_RETRIEVED: "User chats retrieved successfully",
} as const;

export const getChatByReceiverUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { receiverUsername } = req.body;

    if (!receiverUsername || !req.user) {
      res.status(400).send(ChatResponses.RECEIVER_REQUIRED);
      return;
    }

    const receiver: UserType | null = await User.findOne({
      username: receiverUsername,
    });

    if (!receiver) {
      res.status(404).send(ChatResponses.USER_NOT_FOUND);
      return;
    }

    let chat = await Chat.findOne({
      $or: [
        { user1: req.user.id, user2: receiver._id },
        { user1: receiver._id, user2: req.user.id },
      ],
    })
      .populate({
        path: "messages",
        select: "content createdAt",
        populate: [
          {
            path: "author",
            select: "profile_image username",
          },
        ],
      })
      .populate({
        path: "user1",
        select: "profile_image username",
      })
      .populate({
        path: "user2",
        select: "profile_image username",
      });

    if (!chat) {
      chat = new Chat({
        user1: req.user.id,
        user2: receiver._id,
      });
      await chat.save();

      await chat.populate({
        path: "messages",
        select: "content createdAt",
        populate: [
          {
            path: "author",
            select: "profile_image username",
          },
        ],
      });

      await chat.populate({
        path: "user1",
        select: "profile_image username",
      });

      await chat.populate({
        path: "user2",
        select: "profile_image username",
      });
    }

    res.status(200).send(chat);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error getting chat:", errorMessage);
    res.status(500).send(`Error getting chat: ${errorMessage}`);
  }
};

export const getUserChats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(404).send(ChatResponses.USER_NOT_FOUND);
      return;
    }

    const chats = await Chat.find({
      $or: [{ user1: req.user.id }, { user2: req.user.id }],
    })
      .populate({
        path: "user1",
        select: "profile_image username",
      })
      .populate({
        path: "user2",
        select: "profile_image username",
      })
      .populate({
        path: "last_message",
        populate: {
          path: "author",
          select: "username profile_image",
        },
      });

    res.status(200).send(chats);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error getting user chats:", errorMessage);
    res.status(500).send(`Error getting user chats: ${errorMessage}`);
  }
};
