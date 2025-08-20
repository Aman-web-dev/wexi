import { Schema, model } from "mongoose";

const agentSuggestionSchema = new Schema({
  ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
  predictedCategory: { type: String, required: true },
  articleIds: [{ type: Schema.Types.ObjectId, ref: "KnowledgeBase" }],
  draftReply: { type: String },
  confidence: { type: Number, required: true },
  autoClosed: { type: Boolean, default: false },
  modelInfo: {
    provider: { type: String },
    model: { type: String },
    promptVersion: { type: String },
    latencyMs: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
});

export default model("AgentSuggestion", agentSuggestionSchema);
