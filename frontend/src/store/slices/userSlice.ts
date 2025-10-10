import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  editProfile,
  fetchUser,
} from "../actionCreators/userActionCreators.ts";
import { UserState } from "../types/userTypes.ts";
import { CondensedUser, Post, User } from "../types/instanceTypes.ts";
import { logoutUser } from "../actionCreators/authActionCreators.ts";

const initialState: UserState = {
  _id: "",
  username: "",
  email: "",
  fullName: "",
  profile_image: "",
  bio: "",
  website: "",
  posts: [],
  notifications: [],
  followers: [],
  followings: [],
  search_results: [],
  status: "IDLE",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
    },
    addFollowing: (state, action: PayloadAction<CondensedUser>) => {
      state.followings.push(action.payload);
    },
    removeFollowing: (state, action: PayloadAction<CondensedUser>) => {
      state.followings = state.followings.filter((f) => {
        return f._id !== action.payload._id;
      });
    },
    addSearchResult: (state, action: PayloadAction<CondensedUser>) => {
      state.search_results.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "LOADING";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "FETCHED";
        state.error = null;
        state._id = action.payload._id;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.fullName = action.payload.fullName;
        state.profile_image = action.payload.profile_image;
        state.bio = action.payload.bio;
        state.website = action.payload.website;
        state.posts = action.payload.posts;
        state.notifications = action.payload.notifications;
        state.followers = action.payload.followers;
        state.followings = action.payload.followings;
        state.search_results = action.payload.search_results;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "FAILED";
        state.error = (action.payload as string) || "Registration failed";
      })
      .addCase(editProfile.pending, (state) => {
        state.status = "LOADING";
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "EDITED";
        state.error = null;
        state.username = action.payload.username;
        state.profile_image = action.payload.profile_image;
        state.bio = action.payload.bio;
        state.website = action.payload.website;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.status = "FAILED";
        state.error =
          (action.payload as string) || "An unexpected error occurred";
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = (action.payload as string) || "Error in logout User";
      });
  },
});

export const { addPost, addFollowing, removeFollowing, addSearchResult } =
  userSlice.actions;
export default userSlice.reducer;
