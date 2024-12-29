import { Request, Response } from "express";
import PrismaClientInstance from "../config/prismaClient";
import {
  jobSubmitSchema,
  JobStatusSchemaInput,
  jobStatusSchema,
  JobSubmitSchemaInput,
} from "../schemas/jobSchemas";

import jobQueue from "../queues/jobQueue";

const prisma = PrismaClientInstance.getPrismaClient();

export const jobsSubmitController = async (req: Request, res: Response) => {
  try {
    const data: JobSubmitSchemaInput = jobSubmitSchema.parse(req.body);
    const { count, visits } = data;

    if (count !== visits.length) {
      res.status(400).json({ error: "Count and visits length do not match" });
      return;
    }

    const job = await prisma.job.create({
      data: {
        count: count,
        status: "PROCESSING",
        visits: visits,
      },
    });

    await jobQueue.add("jobs", { jobId: job.jobId, visits: visits });
    res.json({ jobid: job.jobId });
  } catch (error: any) {
    console.error("Error in jobsSubmitController:", error);
    if (error.name === "ZodError") {
      res
        .status(400)
        .json({ error: "Invalid input data", details: error.errors });
    } else if ((error.name = "PrismaClientKnownRequestError")) {
      res.status(400).json({ error: "Database error", details: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const jobStatusController = async (req: Request, res: Response) => {
  try {
    const query: JobStatusSchemaInput = jobStatusSchema.parse(req.query);
    const jobId = parseInt(query.jobid);
    const job = await prisma.job.findUnique({
      where: {
        jobId: jobId,
      },
      select: {
        status: true,
        jobId: true,
        error: true,
      },
    });

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    const response: any = {
      jobId: job.jobId,
      status: job.status,
    };

    if (job.error !== null) {
      response.error = JSON.parse(job.error.message);
    }
    res.json(response);
  } catch (error: any) {
    console.error("Error in jobStatusController:", error);
    if (error.name === "ZodError") {
      res
        .status(400)
        .json({ error: "Invalid query data", details: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
