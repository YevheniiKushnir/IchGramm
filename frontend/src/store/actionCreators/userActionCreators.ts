import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { EditProfileData, fetchUserData } from "../types/userTypes.ts";
import { axiosInstance } from "../../utils/apiCalls";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async ({ username }: fetchUserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(`/users/${username}`, config);
      return response.data[0];
    } catch (error: unknown) {
      // return custom error message from backend if present
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      }
    }
  }
);

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (
    { profile_image, username, new_username, website, bio }: EditProfileData,
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      if (profile_image) {
        formData.append("photo", profile_image[0]);
      }
      formData.append("new_username", new_username);
      formData.append("website", website);
      formData.append("bio", bio);

      const response = await axiosInstance.post(
        `/users/${username}/edit`,
        formData
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          return rejectWithValue(error.response.data.message); // Error message from backend
        }
        return rejectWithValue(error.message); // Axios generic error
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);
