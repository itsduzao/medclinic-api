import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post("/register", (req, res) => authController.register(req, res));
