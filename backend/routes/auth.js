const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { authMiddleware, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

// ===== SIGNUP =====
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const lowerEmail = email.toLowerCase();
  const existing = db.get("users").find({ email: lowerEmail }).value();
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const id = db.get("nextUserId").value();

  const newUser = { id, name, email: lowerEmail, password: hashed, created_at: new Date().toISOString() };

  db.get("users").push(newUser).write();
  db.set("nextUserId", id + 1).write();

  const user = { id, name, email: lowerEmail };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({ token, user });
});

// ===== LOGIN =====
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const row = db.get("users").find({ email: email.toLowerCase() }).value();
  if (!row) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = bcrypt.compareSync(password, row.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const user = { id: row.id, name: row.name, email: row.email };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, user });
});

// ===== CURRENT USER =====
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
