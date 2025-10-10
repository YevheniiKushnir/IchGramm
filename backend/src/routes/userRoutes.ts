import express from "express";
import auth from "../middlewares/authMiddleware";
import upload from "../middlewares/uploadImageMiddleware";
import {
  addUserToSearchResults,
  followUser,
  getUserByUsername,
  searchUsers,
  unfollowUser,
  updateProfile,
} from "../controllers/userController";

const router = express.Router();

router.use(auth);

router.get("/:username", getUserByUsername);
router.get("/", searchUsers);
router.post("/:username/follow", followUser);
router.delete("/:username/unfollow", unfollowUser);
router.post("/:username/edit", upload.single("photo"), updateProfile);
router.post("/add_to_search_results", addUserToSearchResults);

export default router;
