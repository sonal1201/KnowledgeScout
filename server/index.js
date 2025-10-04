import express from "express";
// import client from "./utils/redisClient.js";
import authRouter from "./routes/auth-routes.js";
import createUsersTable from "./data/createUserTable.js";
import createDocsTable from "./data/CreateDocsTable.js";
import createDocChunksTable from "./data/createDocChunksTable .js";
import docsRouter from "./routes/docs-route.js";

const app = express();

app.use(express.json());

createUsersTable();
createDocsTable();
createDocChunksTable();

app.use("/api", authRouter);
app.use("/api", docsRouter);

app.listen(3000, () => console.log("Server listening on 3000"));
