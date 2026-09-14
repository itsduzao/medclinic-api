import { Router } from "express";
import { authRouter } from "./auth.routes";
import { userRouter } from "./users.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
