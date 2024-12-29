import { Worker, Job } from "bullmq";
import PrismaClientInstance from "../config/prismaClient";
import redisConfig from "../config/redisConfig";
import { WORKER_CONCURRENCY } from "../config/envConfig";
import axios from "axios";
import validator from "validator";
const prisma = PrismaClientInstance.getPrismaClient();

function processImage(imageUrl: string): number {
  const height = 100;
  const width = 200;

  const perimeter = 2 * (height + width);

  const sleepTime = Math.random() * (400 - 100) + 100;
  sleep(sleepTime);

  return perimeter;
}

function sleep(ms: number) {
  const start = new Date().getTime();
  while (new Date().getTime() < start + ms);
}

const worker = new Worker(
  "jobQueue",
  async (job: Job) => {
    const { jobId, visits } = job.data;
    console.log(`Processing job ${jobId}`);

    // aggregating error messages
    const errorMessages: object[] = [];

    for (const storeData of visits) {
      // store level errors
      const errorMessage: string[] = [];

      try {
        const store = await prisma.store.findUnique({
          where: {
            storeId: storeData.store_id,
          },
        });

        if (!store) {
          errorMessage.push(`Store with ID not found`);
        } else {
          for (const url of storeData.image_url || []) {
            if (!validator.isURL(url)) {
              errorMessage.push(`Invalid URL: ${url}`);
              continue;
            }

            try {
              const response = await axios.head(url);
              const contentType = response.headers["content-type"];
              if (!contentType.startsWith("image/")) {
                errorMessage.push(`Invalid MIME type for URL: ${url}`);
                continue;
              }
            } catch (error) {
              errorMessage.push(`Failed to fetch URL: ${url}`);
              continue;
            }

            const perimeter = processImage(url);
            console.log(`Processed image ${url} with perimeter ${perimeter}`);
          }
        }
      } catch (error: any) {
        errorMessage.push(
          `Error processing store with ID ${storeData.store_id}: ${error.message}`
        );
      }

      // errors
      if (errorMessage.length > 0) {
        errorMessages.push({
          store_id: storeData.store_id,
          error: errorMessage,
        });
      }
    }

    console.log(errorMessages);

    if (errorMessages.length > 0) {
      await prisma.job.update({
        where: {
          jobId: jobId,
        },
        data: {
          status: "FAILED",
          error: {
            create: {
              message: JSON.stringify(errorMessages),
            },
          },
        },
      });
    } else {
      await prisma.job.update({
        where: {
          jobId: jobId,
        },
        data: {
          status: "COMPLETED",
        },
      });
    }
  },
  {
    connection: redisConfig,
    concurrency: WORKER_CONCURRENCY,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.data.jobId} has been completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} has failed with ${err.message}`);
});

async function processVisits(visits: any[]) {
  const errorMessages: string[] = [];

  return errorMessages;
}
