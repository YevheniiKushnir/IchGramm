import mongoose, { Document } from "mongoose";
import { env } from "../config/env";

export interface UserType extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  fullName: string;
  password: string;
  bio?: string; // Optional
  website?: string; // Optional
  profile_image?: string; // Optional
  notifications: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  followings: mongoose.Types.ObjectId[];
  search_results: mongoose.Types.ObjectId[];
  resetPasswordToken?: string; // For password reset
  resetPasswordExpires?: Date; // For password reset token expiration
}

const UserSchema = new mongoose.Schema<UserType>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String, default: "", maxlength: 180 },
  website: { type: String, maxlength: 120 },
  profile_image: {
    type: String,
  },
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  search_results: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const DEFAULT_AVATARS = [
  `${env.BASE_URL}/assets/default_avatars/1.png`,
  `${env.BASE_URL}/assets/default_avatars/2.png`, 
  `${env.BASE_URL}/assets/default_avatars/3.png`,
  `${env.BASE_URL}/assets/default_avatars/4.png`,
  `${env.BASE_URL}/assets/default_avatars/5.png`,
];

UserSchema.pre("save", function (next) {
  if (this.isNew && !this.profile_image) {
    const randomIndex = Math.floor(Math.random() * DEFAULT_AVATARS.length);
    this.profile_image = DEFAULT_AVATARS[randomIndex];
  }
  next();
});

const User = mongoose.model<UserType>("User", UserSchema);

export default User;
