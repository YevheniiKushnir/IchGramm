import { Router } from "express";
import auth from "../middlewares/authMiddleware";
import {
  addCommentToPost,
  likeComment,
  unLikeComment,
} from "../controllers/commentController";
const router: Router = Router();

router.use(auth);

router.post("/:postId/add", addCommentToPost);
router.post("/:commentId/like", likeComment);
router.delete("/:commentId/unlike", unLikeComment);

export default router;
