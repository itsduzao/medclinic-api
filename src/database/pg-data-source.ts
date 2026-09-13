import dotenv from 'dotenv';
import "reflect-metadata";
import { DataSource, type DataSourceOptions } from "typeorm";
import { requiredEnv } from '../utils/requiredEnv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: requiredEnv("DB_HOST"),
  port: Number(process.env.DB_PORT) || 5432,
  username: requiredEnv("DB_USER"),
  password: requiredEnv("DB_PASSWORD"),
  database: requiredEnv("DB_NAME"),
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [import.meta.dirname + "/../**/entities/*.{ts,js}"],
  migrations: [import.meta.dirname + "/migrations/*.{ts,js}"],
};

const pgDataSource = new DataSource(dataSourceOptions)
export default pgDataSource