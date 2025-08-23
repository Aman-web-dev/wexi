import { Worker } from "bullmq";
import { runTriage } from "./triage/index.js";
import { connection } from "./redisConnection.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const url = process.env.MONGO_DB_URI;


const connectToDb = async () => {
  await mongoose
    .connect(url)
    .then(() => {
      console.log("Connetced to DB");
    })
    .catch((err) => {
      console.log(err);
    });
};

connectToDb() 


const triageWorker = new Worker(
  "triage",
  async (job) => {
    console.log("Processing ticket:", job.data.ticketId);
    await runTriage(job.data.ticketId);
  },
  { connection }
);

triageWorker.on("completed", (job) =>
  console.log(`✅ Ticket ${job.data.ticketId} triaged`)
);
triageWorker.on("failed", (job, err) => console.error(`❌ Job failed`, err));
