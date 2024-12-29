import { Queue, RedisConnection } from "bullmq";
import redisConfig from "../config/redisConfig";

const jobQueue = new Queue("jobQueue", {
  connection: redisConfig,
});

export default jobQueue;
