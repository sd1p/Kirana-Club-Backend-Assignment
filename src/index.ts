import express from "express";
import jobsRouter from "./routes/jobsRoutes";

const app = express();

app.use(express.json());
app.use("/api", jobsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
