import type { NextFunction, Request, Response } from "express";
import type { userRole } from "../entities/User";
import { AppError } from "../errors/AppError";

export function requireRole(...allowedRoles: userRole[]) {
	return (req: Request, _res: Response, next: NextFunction) => {
		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return next(new AppError("Forbidden", 403));
		}

		return next();
	};
}
