import { Schema, model } from "mongoose";

const configSchema = new Schema({
	autoCloseEnabled: { type: Boolean, default: false },
	confidenceThreshold: { type: Number, min: 0, max: 1, required: true,default: 0.8 },
	slaHours: { type: Number, required: true,default: 24 }
});

export default model("Config", configSchema);
