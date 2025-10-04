import sql from "../config/db.js";

import bcrypt from "bcrypt";

export const createUser = async (name, email, password) => {
  const hashPassword = await bcrypt.hash(password, 10);

  const [user] = await sql`
  INSERT INTO users (name, email, password_hash)
  VALUES (${name}, ${email}, ${hashPassword})
  RETURNING id, email, created_at
`;

  return user;
};

export const findUserByEmail = async (email) => {
  const [user] = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return user;
};

export const findUserById = async (id) => {
  const [user] = await sql`
    SELECT id, email, created_at FROM users WHERE id = ${id}
  `;
  return user;
};
