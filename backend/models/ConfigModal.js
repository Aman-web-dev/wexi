import { Schema, model } from "mongoose";

const configSchema = new Schema({
	autoCloseEnabled: { type: Boolean, default: false },
	confidenceThreshold: { type: Number, min: 0, max: 1, required: true },
	slaHours: { type: Number, required: true }
});

export default model("Config", configSchema);
