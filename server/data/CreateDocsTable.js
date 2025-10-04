import sql from "../config/db.js";

const createDocsTable = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS docs (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        original_filename TEXT NOT NULL,
        visibility TEXT NOT NULL DEFAULT 'private',
        share_token_hash TEXT,
        page_count INTEGER DEFAULT 0,
        file_path TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("Docs table created successfully!");
  } catch (error) {
    console.error("Error creating docs table: ", error);
  }
};

export default createDocsTable;