import { model, Schema } from "mongoose";

const ticketSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['billing', 'tech', 'shipping', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['open', 'triaged', 'waiting_human', 'resolved', 'closed'],
    default: 'open'
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignee: { type: Schema.Types.ObjectId, ref: 'User' },
  agentSuggestionId: { type: Schema.Types.ObjectId, ref: 'AgentSuggestion' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


export default model("Ticket", ticketSchema);