import { Router } from "express";
import isAuthenticated from "../middleware/authenticated.js";
import { getMessages, sendMessage, uploadFile } from "../controllers/messageController.js";
import upload from "../middleware/multer.js";


const router = Router();

router.route("/", isAuthenticated, sendMessage);
router.route("/:otherUserId").get(isAuthenticated, getMessages)
router.route("/upload").post(isAuthenticated, upload.single("file"), uploadFile)



export default router;