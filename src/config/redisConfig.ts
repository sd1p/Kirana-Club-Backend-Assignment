import { RedisOptions } from "bullmq";
import { REDIS_HOST, REDIS_PORT } from "./envConfig";
const redisConfig: RedisOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

export default redisConfig;
