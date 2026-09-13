import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { userRole } from "../entities/User";
import type { AuthUser } from "../types/express";
import { requiredEnv } from "./requiredEnv";

const JWT_ISSUER = "duZÃO";
const secret = requiredEnv("JWT_SECRET");

type ExpiresIn = NonNullable<SignOptions["expiresIn"]>;

const signOptions: SignOptions = {
	expiresIn: requiredEnv("JWT_EXPIRES_IN") as ExpiresIn,
	issuer: JWT_ISSUER,
};

export interface JwtTokenPayload extends JwtPayload {
	data: AuthUser;
}

export function generateToken(data: AuthUser): string {
	return jwt.sign({ data }, secret, signOptions);
}

function isUserRole(value: unknown): value is userRole {
	return (
		typeof value === "string" &&
		Object.values(userRole).includes(value as userRole)
	);
}

function isValidJwtPayload(
	payload: string | JwtPayload,
): payload is JwtTokenPayload {
	if (typeof payload !== "object" || payload === null) {
		return false;
	}

	const data = payload.data;

	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.id === "number" &&
		isUserRole(data.role)
	);
}

export function verifyToken(token: string): JwtTokenPayload {
	const payload = jwt.verify(token, secret, {
		issuer: JWT_ISSUER,
	});

	if (!isValidJwtPayload(payload)) {
		throw new Error("Invalid JWT Payload");
	}

	return payload;
}
