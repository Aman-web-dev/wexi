import { Queue } from "bullmq";

import {connection} from '../redisConnection.js';

export const triageQueue = new Queue("triage", { connection });

export async function enqueueTriage(ticketId) {
  await triageQueue.add("triageJob", { ticketId });
}