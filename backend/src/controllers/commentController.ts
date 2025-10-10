import { Request, Response } from "express";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Like from "../models/Like";
import mongoose from "mongoose";
import User from "../models/User";
import Notification from "../models/Notification";

const CommentResponses = {
  POST_ID_REQUIRED: "Post ID must be provided",
  POST_NOT_FOUND: "Post not found",
  CONTENT_REQUIRED: "Content is required",
  USER_UNAUTHORIZED: "User is not authorized",
  USER_NOT_FOUND: "User not found",
  COMMENT_CREATED: "Comment created successfully",
  COMMENT_ID_REQUIRED: "Comment ID must be provided",
  COMMENT_NOT_FOUND: "Comment not found",
  LIKE_CREATED: "Like for comment created successfully",
  LIKE_NOT_FOUND: "Like not found",
  LIKE_DELETED: "Like deleted successfully",
} as const;

export const addCommentToPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!postId) {
      res.status(400).send(CommentResponses.POST_ID_REQUIRED);
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).send(CommentResponses.POST_NOT_FOUND);
      return;
    }

    const { content } = req.body;
    if (!content) {
      res.status(400).send(CommentResponses.CONTENT_REQUIRED);
      return;
    }

    if (!req.user) {
      res.status(401).send(CommentResponses.USER_UNAUTHORIZED);
      return;
    }

    const receiver = await User.findById(post.author);
    if (!receiver) {
      res.status(404).send(CommentResponses.USER_NOT_FOUND);
      return;
    }

    const newComment = await Comment.create({
      post: postId,
      author: req.user.id,
      content: content,
    });

    post.comments.push(newComment._id);
    await newComment.save();

    const newNotification = await Notification.create({
      user: post.author,
      actionMaker: req.user.id,
      post: postId,
      type: "commented on your post",
    });

    receiver.notifications.push(newNotification._id);
    await post.save();
    await receiver.save();

    const populatedComment = await newComment.populate({
      path: "author",
      select: "profile_image username",
    });

    res.status(201).send(populatedComment);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error uploading comment:", errorMessage);
    res.status(500).send(`Error uploading comment: ${errorMessage}`);
  }
};

export const likeComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      res.status(400).send(CommentResponses.COMMENT_ID_REQUIRED);
      return;
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).send(CommentResponses.COMMENT_NOT_FOUND);
      return;
    }

    if (!req.user) {
      res.status(401).send(CommentResponses.USER_UNAUTHORIZED);
      return;
    }

    const receiver = await User.findById(comment.author);
    if (!receiver) {
      res.status(404).send(CommentResponses.USER_NOT_FOUND);
      return;
    }

    const newLike = await Like.create({
      user: req.user.id,
      comment: commentId,
    });

    const newNotification = await Notification.create({
      user: comment.author,
      actionMaker: req.user.id,
      comment: comment._id,
      type: "liked your comment",
    });

    await newLike.save();
    comment.likes.push(newLike._id);
    comment.like_count += 1;
    await comment.save();

    receiver.notifications.push(newNotification._id);
    await receiver.save();

    res.status(201).send(CommentResponses.LIKE_CREATED);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error adding like to a comment:", errorMessage);
    res.status(500).send(`Error adding like to a comment: ${errorMessage}`);
  }
};

export const unLikeComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).send(CommentResponses.COMMENT_NOT_FOUND);
      return;
    }

    if (
      !req.user ||
      !new mongoose.Types.ObjectId(req.user.id).equals(comment.author)
    ) {
      res.status(401).send(CommentResponses.USER_UNAUTHORIZED);
      return;
    }

    const like = await Like.findOne({
      user: req.user.id,
      comment: comment._id,
    });

    if (!like) {
      res.status(404).send(CommentResponses.LIKE_NOT_FOUND);
      return;
    }

    await Like.deleteOne({ _id: like._id });

    comment.likes = comment.likes.filter(
      (likeId) => likeId.toString() !== like._id.toString()
    );
    comment.like_count -= 1;
    await comment.save();

    res.status(200).send(CommentResponses.LIKE_DELETED);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error unliking a comment:", errorMessage);
    res.status(500).send(`Error unliking a comment: ${errorMessage}`);
  }
};
