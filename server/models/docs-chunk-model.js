import sql from "../config/db.js";

export const insertDocChunk = async ({ docId, pageNumber, chunkIndex, text, embedding, tokenCount }) => {
  await sql`
    INSERT INTO doc_chunks (doc_id, page_number, chunk_index, text, embedding, token_count)
    VALUES (${docId}, ${pageNumber}, ${chunkIndex}, ${text}, ${embedding}, ${tokenCount})
  `;
};
