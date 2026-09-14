import { IsEmail, IsEnum, IsString } from "class-validator";
import { userRole } from "../entities/User";

export class CreateUserDto {
	@IsString()
	name!: string;

	@IsString()
	password!: string;

	@IsEmail()
	email!: string;

	@IsEnum(userRole)
	role!: userRole;
}
