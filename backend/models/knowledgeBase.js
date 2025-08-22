import { Schema, model } from "mongoose";

const KB = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  {
    timestamps: { updatedAt: true, createdAt: false },
  }
);

export default model("KnowledgeBase", KB);