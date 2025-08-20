import express from "express";
import {
  getAllKnowledgeBase,
  createKnowledgeBase,
  updateKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBaseById,
} from "../controllers/knowledgeBaseController.js";

const KnowledgeBaseRouter = express.Router();

// GET /api/v1/knowledgeBase
KnowledgeBaseRouter.get("/", getAllKnowledgeBase);

// POST /api/v1/knowledgeBase (admin)
KnowledgeBaseRouter.post("/", createKnowledgeBase);

// GET /api/v1/knowledgeBase/:userId (admin)
KnowledgeBaseRouter.get("/:id", getKnowledgeBaseById);

// DELETE /api/v1/knowledgeBase/:id (admin)
KnowledgeBaseRouter.delete("/:id", deleteKnowledgeBase);

// PUT /api/v1/knowledgeBase/:id (admin)
KnowledgeBaseRouter.put("/:id", updateKnowledgeBase);

export default KnowledgeBaseRouter;
