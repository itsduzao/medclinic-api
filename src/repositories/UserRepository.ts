import pgDataSource from "../database/pg-data-source";
import { User } from "../entities/User";

export const userRepository = pgDataSource.getRepository(User);
