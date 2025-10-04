import jwt from "jsonwebtoken";
import { findUserById } from "../models/user-model.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: { code: "UNAUTHORIZED", message: "No token provided" } });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ error: { code: "UNAUTHORIZED", message: "Invalid token" } });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ error: { code: "UNAUTHORIZED", message: "Invalid token" } });
  }
};
