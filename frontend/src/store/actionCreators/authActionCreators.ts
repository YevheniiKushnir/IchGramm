import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  LoginDataType,
  RegisterDataType,
  ResetDataType,
} from "../types/authTypes.ts";
import { axiosInstance } from "../../utils/apiCalls";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterDataType, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/register", userData);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return rejectWithValue(String(error.response.data));
      }
      return rejectWithValue("Registration failed");
    }
  }
);

export const userLogin = createAsyncThunk(
  "auth/login",
  async (loginData: LoginDataType, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", loginData);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return rejectWithValue(String(error.response.data));
      }
      return rejectWithValue("Login failed");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/reset",
  async (resetData: ResetDataType, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/reset", resetData);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return rejectWithValue(String(error.response.data));
      }
      return rejectWithValue("Reset failed");
    }
  }
);

export const confirmPasswordReset = createAsyncThunk(
  "auth/confirmReset",
  async (
    { token, newPassword }: { token: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post("/auth/reset-confirm", {
        token,
        newPassword,
      });
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return rejectWithValue(String(error.response.data));
      }
      return rejectWithValue("Password reset failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      document.cookie = "";
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return rejectWithValue(String(error.response.data));
      }
      return rejectWithValue("Logout failed");
    }
  }
);
