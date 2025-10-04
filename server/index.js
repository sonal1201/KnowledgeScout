import express from "express"
import client from "./utils/redisClient.js";
import authRouter from "./routes/auth-routes.js";
import createUsersTable from "./data/createUserTable.js";

const app = express();

app.use(express.json());

createUsersTable();

app.use('/api',authRouter);

app.listen(3000, () => console.log("Server listening on 3000"));