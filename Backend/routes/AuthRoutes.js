import {
	Register,
	Login,
	Logout,
} from "../controllers/Auth.js";
import { protectRoute } from "../middleware/Authmiddleware.js";
import { Router } from "express";

const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", protectRoute, Logout);
export default router;
