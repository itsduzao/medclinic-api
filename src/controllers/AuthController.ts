import type { Response } from "express";
import type { CreateUserDto } from "../dtos/CreateUserDto";
import { AuthService } from "../services/AuthService";
import type { TypedBodyRequest } from "../types/express";

const authService = new AuthService();

export class AuthController {
	async register(
		req: TypedBodyRequest<CreateUserDto>,
		res: Response,
	): Promise<Response> {
		const { email, name, password, role } = req.body;

		if (!email || !name || !password || !role)
			return res.status(400).json({
				error: "You must fill all required fields",
			});

		const user = await authService.createUser({
			email,
			name,
			password,
			role,
		});

		return res.status(201).json({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	}
}
