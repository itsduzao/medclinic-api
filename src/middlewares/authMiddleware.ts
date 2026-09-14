import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { verifyToken } from "../utils/jwt";

function throwUnauthorizedError() {
	return new AppError("Unauthorized", 401);
}

export function AuthHandler(req: Request, _res: Response, next: NextFunction) {
	const { authorization } = req.headers;

	if (!authorization?.startsWith("Bearer ")) {
		return next(throwUnauthorizedError());
	}

	const token = authorization.split(" ")[1];

	if (!token) {
		return next(throwUnauthorizedError());
	}

	try {
		const { data } = verifyToken(token);
		const authenticatedUser = { ...data };

		req.user = authenticatedUser;
		return next();
	} catch {
		return next(throwUnauthorizedError());
	}
}
