import { createUser, findUserByEmail } from "../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: {
        code: "FIELD REQUIRED",
        field: !email ? "email" : "password",
        message: `${!email ? "Email" : "Password"} is required`,
      },
    });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: { code: "EMAIL EXISTS", message: "Email already registered" },
      });
    }
    //create user
    const user = await createUser(name, email, password);

    res.status(201).json({
      message: "User created Successfully",
      user: { id: user.id, email: user.email, created_at: user.created_at },
    });
    s;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: { code: "SERVER ERROR", message: "Internal server error" },
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: {
        code: "FIELD REQUIRED",
        field: !email ? "email" : "password",
        message: `${!email ? "Email" : "Password"} is required`,
      },
    });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({
          error: {
            code: "INVALID CREDENTIALS",
            message: "Invalid credentials",
          },
        });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res
        .status(401)
        .json({
          error: {
            code: "INVALID CREDENTIALS",
            message: "Invalid credentials",
          },
        });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "User signedIn successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: { code: "SERVER ERROR", message: "Internal server error" },
      });
  }
};
