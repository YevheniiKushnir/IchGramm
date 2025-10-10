import { createSlice } from "@reduxjs/toolkit";
import { authStateType } from "../types/authTypes.ts";
import {
  registerUser,
  resetPassword,
  userLogin,
  logoutUser,
  confirmPasswordReset,
} from "../actionCreators/authActionCreators.ts";

const initialState: authStateType = {
  status: "IDLE",
  error: null,
  userId: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "LOADING";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "REGISTERED";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "FAILED";
        state.error = (action.payload as string) || "Registration failed";
      })
      .addCase(confirmPasswordReset.pending, (state) => {
        state.status = "LOADING";
        state.error = null;
      })
      .addCase(confirmPasswordReset.fulfilled, () => initialState)
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.status = "FAILED";
        state.error = (action.payload as string) || "Password reset failed";
      })
      .addCase(userLogin.pending, (state) => {
        state.status = "LOADING";
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = "SUCCEEDED";
        state.error = null;
        state.userId = action.payload.data.id;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = "FAILED";
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "LOADING";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, () => initialState)
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "FAILED";
        state.error = (action.payload as string) || "Reset failed";
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export default authSlice.reducer;
