import { docQueue } from "../config/queue.js";
import { createDoc, getDocById, getDocsByOwner } from "../models/docs-model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const uploadDoc = async (req, res) => {
  const ownerId = req.user.id;
  const { title } = req.body;
  const file = req.file;

  if (!file || !title) {
    return res.status(400).json({
      error: { code: "FIELD_REQUIRED", message: "Title and file are required" },
    });
  }

  if (file.size > 20 * 1024 * 1024) {
    return res.status(400).json({
      error: {
        code: "FILE_TOO_LARGE",
        message: "File size exceeds the allowed limit of 20MB.",
      },
    });
  };

  try {
    const fileUrl = await uploadToCloudinary(file);
    const doc = await createDoc(
      ownerId,
      title,
      file.originalname,
      fileUrl,
    );

     await docQueue.add("extract-and-embed", { docId: doc.id, fileUrl });

    res.status(201).json({
      doc,
      message: "Document uploaded successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
};

export const getDoc = async (req, res) => {
  const docId = parseInt(req.params.id);
  const ownerId = req.user.id;

  try {
    const doc = await getDocById(docId, ownerId);

    if (!doc) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Document not found" },
      });
    }

    res.json({ doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
};

export const listDocs = async (req, res) => {
  const ownerId = req.user.id;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const result = await getDocsByOwner(ownerId, limit, offset); // now imported from model
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
};


export const saveEmbeddings = async (docId, embedding) => {
  await sql`INSERT INTO doc_embeddings (doc_id, embedding) VALUES (${docId}, ${embedding})`;
};

export const updateDocStatus = async (docId, status) => {
  await sql`UPDATE docs SET indexing_status = ${status} WHERE id = ${docId}`;
};