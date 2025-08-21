import { Worker } from "bullmq";
import { runTriage } from "./triage/index.js";

const connection = { host: "localhost", port: 6379 };

const triageWorker = new Worker("triage", async job => {
  console.log("Processing ticket:", job.data.ticketId);
  await runTriage(job.data.ticketId);
}, { connection });





triageWorker.on("completed", job => console.log(`✅ Ticket ${job.data.ticketId} triaged`));
triageWorker.on("failed", (job, err) => console.error(`❌ Job failed`, err));
