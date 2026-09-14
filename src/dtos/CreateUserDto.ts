import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { userRole } from "../entities/User";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsString()
	@IsNotEmpty()
	password!: string;

	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@IsEnum(userRole)
	@IsNotEmpty()
	role!: userRole;
}
