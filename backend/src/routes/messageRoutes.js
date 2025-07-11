import { Router } from "express";
import isAuthenticated from "../middleware/authenticated.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";


const router = Router();

router.route("/", isAuthenticated, sendMessage);
router.route("/:otherUserId").get(isAuthenticated, getMessages)



export default router;