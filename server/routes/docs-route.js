import express from "express";
import { uploadDoc, listDocs, getDoc } from "../controllers/docs-controller.js";
import { upload } from "../middlewares/multer-middleware.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = express.Router();

// Upload document (multipart)
router.post("/docs", authMiddleware, upload.single("file"), uploadDoc);

// List documents with pagination
router.get("/docs", authMiddleware, listDocs);

router.get("/docs/:id", authMiddleware, getDoc);

export default router;
