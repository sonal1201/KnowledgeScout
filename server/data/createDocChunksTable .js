import sql from "../config/db.js";

const createDocChunksTable = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS doc_chunks (
        id SERIAL PRIMARY KEY,
        doc_id INTEGER NOT NULL REFERENCES docs(id) ON DELETE CASCADE,
        page_number INTEGER NOT NULL,
        chunk_index INTEGER NOT NULL,
        text TEXT NOT NULL,
        embedding VECTOR(1536), -- requires pgvector extension
        token_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("doc_chunks table created successfully!");
  } catch (error) {
    console.error("Error creating doc_chunks table: ", error);
  }
};

export default createDocChunksTable;
