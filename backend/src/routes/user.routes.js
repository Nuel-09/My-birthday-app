import { Router } from "express";
import { listUsers, registerUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", listUsers);
router.post("/", registerUser);

export default router;
