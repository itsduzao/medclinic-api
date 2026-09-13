import { hash, verify } from "argon2";

export async function hashPassword(password: string): Promise<string> {
	return hash(password);
}

export async function comparePassword(
	hashPassword: string,
	plainPassword: string,
): Promise<boolean> {
	return verify(hashPassword, plainPassword);
}
