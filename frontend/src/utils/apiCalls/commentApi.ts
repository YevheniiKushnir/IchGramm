import { axiosInstance } from "./index.ts";

export const addComment = async (content: string, postId: string) => {
  try {
    const response = await axiosInstance.post(`/comments/${postId}/add`, {
      content,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding comment", error);
  }
};

export const likeComment = async (commentId: string) => {
  try {
    const response = await axiosInstance.post(
      `/comments/${commentId}/like`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Error liking comment", error);
  }
};

export const unLikeComment = async (commentId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/comments/${commentId}/unlike`
    );
    return response.data;
  } catch (error) {
    console.error("Error unliking comment", error);
  }
};
