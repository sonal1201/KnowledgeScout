import { Queue } from "bullmq";

export const docQueue = new Queue("doc-processing", {
  connection: { host: "127.0.0.1", port: 6379 },
});
