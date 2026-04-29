import { User } from "../models/user.model.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeDateOnly(dateInput) {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
}

export async function registerUser(req, res) {
  try {
    const { username, email, dateOfBirth } = req.body;

    if (!username || !email || !dateOfBirth) {
      return res.status(400).json({
        message: "username, email, and dateOfBirth are required.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const normalizedDob = normalizeDateOnly(dateOfBirth);
    if (!normalizedDob) {
      return res.status(400).json({ message: "Please provide a valid dateOfBirth value." });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      dateOfBirth: normalizedDob,
    });

    return res.status(201).json({
      message: "User added successfully.",
      user,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Email already exists." });
    }
    return res.status(500).json({ message: "Failed to create user." });
  }
}

export async function listUsers(_req, res) {
  try {
    const users = await User.find().sort({ username: 1, createdAt: -1 }).lean();
    return res.json({ users });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to fetch users." });
  }
}
