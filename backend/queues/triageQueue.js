import { Queue } from "bullmq";



const connection = { host: process.env.REDIS_HOST || "localhost" } ;
export const triageQueue = new Queue("triage", { connection });

export async function enqueueTriage(ticketId) {
  await triageQueue.add("triageJob", { ticketId });
}