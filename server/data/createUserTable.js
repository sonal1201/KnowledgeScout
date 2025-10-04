import sql from "../config/db.js";

const createUsersTable = async()=>{
    const queryText = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`

    try {
        await sql.query(queryText);
        console.log("User table created if not existed");
    } catch (error) {
        console.log("Error creating user table: ", error)
    }
}

export default createUsersTable;