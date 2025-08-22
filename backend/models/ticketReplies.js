import { model, Schema } from "mongoose";

const ticketRepliesSchema = new Schema({
  ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
  reply: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});



export default model("TicketReplies", ticketRepliesSchema);