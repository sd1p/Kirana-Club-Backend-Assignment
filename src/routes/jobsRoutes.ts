import { Router } from "express";
import {
  jobsSubmitController,
  jobStatusController,
} from "../controllers/jobsController";

const jobsRouter = Router();

jobsRouter.post("/submit", jobsSubmitController);
jobsRouter.get(`/status`, jobStatusController);

export default jobsRouter;
