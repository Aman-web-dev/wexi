import express from "express";
import {
  getAllKnowledgeBase,
  createKnowledgeBase,
  updateKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBaseById,
} from "../controllers/knowledgeBaseController.js";
import { auth } from "../middleware/authMiddleware.js";
const KnowledgeBaseRoutes = express.Router();


KnowledgeBaseRoutes.use(auth);

// GET /api/v1/knowledgeBase
KnowledgeBaseRoutes.get("/", getAllKnowledgeBase);

// POST /api/v1/knowledgeBase (admin)
KnowledgeBaseRoutes.post("/", createKnowledgeBase);

// GET /api/v1/knowledgeBase/:userId (admin)
KnowledgeBaseRoutes.get("/:id", getKnowledgeBaseById);

// DELETE /api/v1/knowledgeBase/:id (admin)
KnowledgeBaseRoutes.delete("/:id", deleteKnowledgeBase);

// PUT /api/v1/knowledgeBase/:id (admin)
KnowledgeBaseRoutes.put("/:id", updateKnowledgeBase);

export default KnowledgeBaseRoutes;
