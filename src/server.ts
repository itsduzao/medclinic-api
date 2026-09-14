import express from "express";
import pgDataSource from "./database/pg-data-source";
import { errorHandler } from "./middlewares/errorHandler";
import { router } from "./routes";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

async function startServer() {
	try {
		await pgDataSource.initialize();
		console.log("Datasource connected successfully");

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to connect to the database", error);
		process.exit(1);
	}
}

startServer();

app.use("/api/v1", router);
app.use(errorHandler);
