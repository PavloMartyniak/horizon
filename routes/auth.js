import express from "express";
import { sign_in, sign_up } from "../controllers/auth.js";

const router = express.Router();

//CREATE
router.post("/sign-up", sign_up);
router.post("/sign-in", sign_in);

export default router;
