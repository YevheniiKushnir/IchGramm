import User, { UserType } from "../models/User";
import { Request, Response } from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification";
import { cloudinary } from "../config/cloudinary";

const UserResponses = {
  USER_NOT_FOUND: "User not found",
  USERNAME_EXISTS: "Username already exists",
  ALREADY_FOLLOWED: "Already followed",
  FOLLOWING_NOT_FOUND: "Following not found",
  USERS_REQUIRED: "Users must be provided",
  USER_ADDED_TO_SEARCH: "User added to search results",
  USERNAME_AND_AUTH_REQUIRED: "Username and authenticated user are required",
} as const;

export const getUserByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    if (!req.user) return;

    let user;

    if (username === req.user.username) {
      user = await User.find({ username })
        .select("-password")
        .populate({
          path: "followings",
          select: "profile_image username _id",
        })
        .populate({
          path: "followers",
          select: "profile_image username _id",
        })
        .populate({
          path: "posts",
          populate: [
            {
              path: "photos",
              select: "url",
            },
          ],
        })
        .populate({
          path: "notifications",
          options: { sort: { createdAt: -1 }, limit: 10 },
          populate: [
            {
              path: "post",
              populate: [
                {
                  path: "photos",
                  select: "url",
                },
              ],
            },
            {
              path: "comment",
              select: "author",
              populate: [
                {
                  path: "post",
                  populate: [
                    {
                      path: "photos",
                      select: "url",
                    },
                  ],
                },
              ],
            },
            {
              path: "actionMaker",
              select: "username profile_image",
            },
          ],
        })
        .populate("search_results", "username profile_image");
    } else {
      user = await User.find({ username })
        .select("-password")
        .populate({
          path: "followings",
          select: "profile_image username _id",
        })
        .populate({
          path: "followers",
          select: "profile_image username _id",
        })
        .populate({
          path: "posts",
          populate: [
            {
              path: "photos",
              select: "url",
            },
          ],
        });
    }

    if (!user) {
      res.status(404).send(UserResponses.USER_NOT_FOUND);
      return;
    }

    res.status(200).send(user);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error fetching a user:", errorMessage);
    res.status(500).send(`Error fetching a user: ${errorMessage}`);
  }
};

export const searchUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({}, "username profile_image");
    res.status(200).send(users);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error searching users:", errorMessage);
    res.status(500).send(`Error searching users: ${errorMessage}`);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    // Check if user exists
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      res.status(404).send(UserResponses.USER_NOT_FOUND);
      return;
    }

    const { bio, website, new_username } = req.body;

    // Check if new username already exists
    if (new_username && new_username !== username) {
      const newUsernameUser = await User.findOne({ username: new_username });
      if (newUsernameUser) {
        res.status(400).json({ message: UserResponses.USERNAME_EXISTS });
        return;
      }
      user.username = new_username;
    }

    // Update bio and website
    if (website && website.length <= 120) {
      user.website = website;
    }
    if (bio && bio.length <= 150) {
      user.bio = bio;
    }

    // Upload new profile image to Cloudinary
    const file = req.file;
    if (file) {
      const uploadedImage = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profiles", // Optional folder in Cloudinary
              public_id: `${username}-profile`, // Optional custom public ID
              overwrite: true, // Overwrite existing image for the user
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                if (!result) return;
                resolve(result.secure_url); // Get the secure URL
              }
            }
          )
          .end(file.buffer); // Upload the file buffer
      });
      if (user.profile_image !== uploadedImage) {
        user.profile_image = uploadedImage;
      }
    }

    // Save updated user
    const updatedUser = await user.save();
    res.status(200).send(updatedUser);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error updating a user profile:", errorMessage);
    res.status(500).send(`Error updating a user profile: ${errorMessage}`);
  }
};

export const followUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    if (!username || !req.user) {
      res.status(400).send(UserResponses.USERNAME_AND_AUTH_REQUIRED);
      return;
    }

    const profile = await User.findOne({ username });
    const user = await User.findById(req.user.id);

    if (!profile || !user) {
      res.status(404).send(UserResponses.USER_NOT_FOUND);
      return;
    }

    // Check follow
    const isFollowed = profile.followers.includes(user._id);
    if (isFollowed) {
      res.status(400).send(UserResponses.ALREADY_FOLLOWED);
      return;
    }

    // Unfollow
    profile.followers.push(user._id);
    user.followings.push(profile._id);

    const newNotification = await Notification.create({
      user: profile._id,
      actionMaker: user._id,
      type: "started following you",
    });

    profile.notifications.push(newNotification._id);
    await profile.save();
    await user.save();

    res.status(201).send({
      _id: profile._id,
      profile_image: profile.profile_image,
      username: profile.username,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error following a user:", errorMessage);
    res.status(500).send(`Error following a user: ${errorMessage}`);
  }
};

export const unfollowUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    if (!username || !req.user) {
      res.status(400).send(UserResponses.USERNAME_AND_AUTH_REQUIRED);
      return;
    }

    const profile = await User.findOne({ username });
    const user = await User.findById(req.user.id);

    if (!profile || !user) {
      res.status(404).send(UserResponses.USER_NOT_FOUND);
      return;
    }

    // Check follow
    const isFollowed = profile.followers.includes(user._id);
    if (!isFollowed) {
      res.status(404).send(UserResponses.FOLLOWING_NOT_FOUND);
      return;
    }

    // Unfollow
    profile.followers = profile.followers.filter(
      (f: mongoose.Types.ObjectId) => !f.equals(user._id)
    );
    user.followings = user.followings.filter(
      (f: mongoose.Types.ObjectId) => !f.equals(profile._id)
    );

    await profile.save();
    await user.save();

    res.status(200).send({
      _id: profile._id,
      profile_image: profile.profile_image,
      username: profile.username,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error unfollowing a user:", errorMessage);
    res.status(500).send(`Error unfollowing a user: ${errorMessage}`);
  }
};

export const addUserToSearchResults = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.body;

    if (!username || !req.user) {
      res.status(400).send(UserResponses.USERS_REQUIRED);
      return;
    }

    const user: UserType | null = await User.findById(req.user.id);
    const searchedUser: UserType | null = await User.findOne({ username });

    if (!user || !searchedUser) {
      res.status(404).send(UserResponses.USER_NOT_FOUND);
      return;
    }

    user.search_results.push(searchedUser._id);
    await user.save();

    res.status(200).send(UserResponses.USER_ADDED_TO_SEARCH);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error adding user to search results:", errorMessage);
    res
      .status(500)
      .send(`Error adding user to search results: ${errorMessage}`);
  }
};
