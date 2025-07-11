import { Router } from "express";
import { getAllUser, isMe, loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import isAuthenticated from "../middleware/authenticated.js";

const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticated, logoutUser);
router.route("/profile").get(isAuthenticated, isMe)
router.route("/users").get(isAuthenticated, getAllUser);



export default router;