import type { CreateUserDto } from "../dtos/CreateUserDto";
import type { LoginDto } from "../dtos/LoginDto";
import type { User, userRole } from "../entities/User";
import { AppError } from "../errors/AppError";
import { userRepository } from "../repositories/UserRepository";
import { generateToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

type LoginResult = {
	token: string;
	user: {
		id: number;
		name: string;
		email: string;
		role: userRole;
	};
};

export class AuthService {
	async createUser(data: CreateUserDto): Promise<User> {
		const existingUser = await userRepository.findOneBy({
			email: data.email,
		});

		if (existingUser) {
			throw new AppError("User already exists", 409);
		}

		const user = userRepository.create({
			...data,
			password: await hashPassword(data.password),
		});

		return userRepository.save(user);
	}

	async login(data: LoginDto): Promise<LoginResult> {
		const user = await userRepository.findOneBy({ email: data.email });

		if (!user) throw new AppError("Incorrect credentials", 401);

		const IsValidPassword = await comparePassword(user.password, data.password);

		if (!IsValidPassword) throw new AppError("Incorrect credentials", 401);

		const token = generateToken({ id: user.id, role: user.role });

		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		};
	}
}
