import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { validateDto } from "../middlewares/validate";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post("/register", validateDto(CreateUserDto), (req, res) =>
	authController.register(req, res),
);
