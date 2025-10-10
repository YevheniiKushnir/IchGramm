import { axiosInstance } from "./index.ts";

export const likePost = async (postId: string) => {
  try {
    const response = await axiosInstance.post(`/posts/${postId}/like`, {});
    return response.data;
  } catch (error) {
    console.error("Error liking post", error);
  }
};

export const unLikePost = async (postId: string) => {
  try {
    const response = await axiosInstance.delete(`/posts/${postId}/unlike`);
    return response.data;
  } catch (error) {
    console.error("Error unliking post", error);
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error unliking post", error);
  }
};

export const fetchFollowedPosts = async (page: number) => {
  try {
    const response = await axiosInstance.get(
      `/posts/get_followed?page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching chat messages", error);
  }
};

export const getRandomPosts = async (fetchCount: number) => {
  try {
    const response = await axiosInstance.get(
      `/posts/random?count=${fetchCount}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting users", error);
  }
};
