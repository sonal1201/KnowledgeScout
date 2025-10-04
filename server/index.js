import express from "express"
import client from "./utils/redisClient.js";

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", async (req, res) => {
  const value = await client.set("ping", "pong", { ex: 10 }); // expire in 10s
  const redisValue = await client.get("ping");

  res.json({
    message: "ping message",
    redis_test: redisValue
  });
});


app.listen(3000, () => console.log("Server listening on 3000"));