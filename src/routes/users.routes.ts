import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthHandler } from "../middlewares/authMiddleware";

export const userRouter = Router();

const userController = new UserController();

userRouter.get("/me", AuthHandler, (req, res) =>
	userController.getUserProfile(req, res),
);
