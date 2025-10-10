import { Router } from "express";
import auth from "../middlewares/authMiddleware";
import {
  getChatByReceiverUsername,
  getUserChats,
} from "../controllers/messageController";

const router: Router = Router();

router.use(auth);

router.post("/get_chat", getChatByReceiverUsername);
router.get("/get_user_chats", getUserChats);

export default router;
