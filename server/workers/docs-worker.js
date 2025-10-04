import redisClient from "../config/redis.js";
import { extractTextFromPDF } from "../utils/pdf.js";
import { splitTextIntoChunks } from "../utils/chunking.js";
import { generateEmbeddings } from "../utils/embeddings.js";
import { insertDocChunk } from "../models/doc-chunks-model.js";

async function processQueue() {
  console.log("Worker started, waiting for jobs...");

  while (true) {
    try {
      // BRPOP blocks until a job is available
      const job = await redisClient.brpop("doc_queue", 0);
      const docJob = JSON.parse(job[1]);

      console.log("Processing doc:", docJob.docId);

      const pagesText = await extractTextFromPDF(docJob.filePath);

      for (let pageNumber = 0; pageNumber < pagesText.length; pageNumber++) {
        const chunks = splitTextIntoChunks(pagesText[pageNumber]);

        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
          const chunk = chunks[chunkIndex];
          const embedding = await generateEmbeddings(chunk);

          await insertDocChunk({
            docId: docJob.docId,
            pageNumber,
            chunkIndex,
            text: chunk,
            embedding,
            tokenCount: chunk.length,
          });
        }
      }

      console.log("Finished doc:", docJob.docId);
    } catch (err) {
      console.error("Worker error:", err);
    }
  }
}

processQueue();
