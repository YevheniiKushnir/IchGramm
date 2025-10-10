import express from "express";
import auth from "../middlewares/authMiddleware";
import upload from "../middlewares/uploadImageMiddleware";
import {
  createPost,
  getPostById,
  likePost,
  deletePost,
  unLikePost,
  updatePost,
  getFollowedPosts,
  getRandomPosts,
} from "../controllers/postController";

const router = express.Router();

router.use(auth);

router.get("/get/:postId", getPostById);
router.get("/get_followed", getFollowedPosts);
router.get("/random", getRandomPosts);
router.post("/create", upload.array("photos", 8), createPost);
router.put("/:postId", updatePost);
router.post("/:postId/like", likePost);
router.delete("/:postId", deletePost);
router.delete("/:postId/unlike", unLikePost);

export default router;
