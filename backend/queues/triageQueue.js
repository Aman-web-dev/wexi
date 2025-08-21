import { Queue } from "bullmq";



const connection = { host: "localhost", port: 6379 };
export const triageQueue = new Queue("triage", { connection });

export async function enqueueTriage(ticketId) {
  await triageQueue.add("triageJob", { ticketId });
}