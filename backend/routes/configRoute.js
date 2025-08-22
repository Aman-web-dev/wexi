import auth from "../middleware/auth.js";
import express from "express";

const configRoutes = express.Router();

import { getConfig, updateConfig } from "../controllers/configController.js";

configRoutes.use(auth);

configRoutes.get("/", getConfig);
configRoutes.put("/", updateConfig);

export default configRoutes;
