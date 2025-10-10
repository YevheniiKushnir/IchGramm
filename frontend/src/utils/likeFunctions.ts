import React, { Dispatch, MouseEvent } from "react";
import { likePost, unLikePost } from "./apiCalls/postApi.ts";
import { unLikeComment, likeComment } from "./apiCalls/commentApi.ts";
import { like, liked } from "../assets/post/index.ts";
import { LikesFields, Post } from "../store/types/instanceTypes.ts";

export const onLikeComment = async (
  e: MouseEvent<HTMLImageElement>,
  commentId: string,
  post: Post | null,
  setPost: Dispatch<React.SetStateAction<Post | null>>
) => {
  const target = e.target as HTMLImageElement;
  if (!target) return;

  if (target.src === like) {
    await likeComment(commentId);

    // Update the UI immediately after liking the comment
    if (!post) return;
    const updatedPost = { ...post };
    const updatedComment = updatedPost?.comments.find(
      (c) => c._id === commentId
    );
    if (updatedComment) {
      // Create a new comment object with the updated like_count
      const modifiedComment = {
        ...updatedComment,
        like_count: updatedComment.like_count + 1,
      };

      // Replace the old comment with the modified one
      updatedPost.comments = updatedPost.comments.map((comment) =>
        comment._id === commentId ? modifiedComment : comment
      );
    }
    setPost(updatedPost);

    target.src = liked;
  } else {
    await unLikeComment(commentId);

    // Update the UI immediately after liking the comment
    if (!post) return;
    const updatedPost = { ...post };
    const updatedComment = updatedPost?.comments.find(
      (c) => c._id === commentId
    );
    if (updatedComment) {
      // Create a new comment object with the updated like_count
      const modifiedComment = {
        ...updatedComment,
        like_count: updatedComment.like_count - 1,
      };

      // Replace the old comment with the modified one
      updatedPost.comments = updatedPost.comments.map((comment) =>
        comment._id === commentId ? modifiedComment : comment
      );
    }
    setPost(updatedPost);

    target.src = like;
  }
};

export const onLikePost = async (
  e: MouseEvent<HTMLImageElement>,
  postId: string,
  post: Post | null,
  setPost: Dispatch<React.SetStateAction<Post | null>>
) => {
  const target = e.target as HTMLImageElement;
  if (target.src === like) {
    await likePost(postId);

    // Update the UI immediately after liking the comment
    if (post) {
      setPost({ ...post, like_count: post.like_count + 1 });
    }

    target.src = liked;
  } else {
    await unLikePost(postId);

    // Update the UI immediately after liking the comment
    if (post) {
      setPost({ ...post, like_count: post.like_count - 1 });
    }

    target.src = like;
  }
};

export const onLikePostFromHomepage = async (
  e: MouseEvent<HTMLImageElement>,
  postId: string,
  setPosts: Dispatch<React.SetStateAction<Post[]>>
) => {
  const target = e.target as HTMLImageElement;
  if (target.src === like) {
    await likePost(postId);

    // Update the UI immediately after liking the comment
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? { ...post, like_count: post.like_count + 1 }
          : post
      )
    );

    target.src = liked;
  } else {
    await unLikePost(postId);

    // Update the UI immediately after liking the comment
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? { ...post, like_count: post.like_count - 1 }
          : post
      )
    );

    target.src = like;
  }
};

export const isLikedByUser = (likedBy: LikesFields[], userId: string) => {
  if (!userId) return;
  const res = likedBy.filter((like) => like.user === userId);
  return res.length > 0;
};
