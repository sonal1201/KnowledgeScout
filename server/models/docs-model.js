import sql from "../config/db.js";

export const createDoc = async (
  ownerId,
  title,
  originalFilename,
  filePath,
  visibility = "private"
) => {
  const [doc] = await sql`
    INSERT INTO docs (owner_id, title, original_filename, file_path, visibility)
    VALUES (${ownerId}, ${title}, ${originalFilename}, ${filePath}, ${visibility})
    RETURNING id, title, visibility, created_at
  `;
  return doc;
};

export const getDocsByOwner = async (ownerId, limit = 10, offset = 0) => {
  const items = await sql`
    SELECT id, title, visibility, created_at
    FROM docs
    WHERE owner_id = ${ownerId}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const nextOffset = items.length === limit ? offset + limit : null;
  return { items, next_offset: nextOffset };
};

export const getDocById = async (docId, ownerId) => {
  const [doc] = await sql`
    SELECT id, title, visibility, created_at
    FROM docs
    WHERE id = ${docId} AND owner_id = ${ownerId}
  `;
  return doc;
};
