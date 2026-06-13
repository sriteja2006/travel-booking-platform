const express = require("express");
const db = require("../config/db");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// All booking routes require login
router.use(authMiddleware);

// ===== GET all bookings for logged-in user =====
router.get("/", (req, res) => {
  const rows = db
    .get("bookings")
    .filter({ user_id: req.user.id })
    .orderBy("created_at", "desc")
    .value();

  res.json({ bookings: rows });
});

// ===== CREATE a booking (add to itinerary) =====
router.post("/", (req, res) => {
  const { type, title, detail, price } = req.body;

  if (!type || !title || price === undefined) {
    return res.status(400).json({ error: "type, title and price are required" });
  }

  const confirmId = "TRV-" + Math.floor(100000 + Math.random() * 900000);
  const id = db.get("nextBookingId").value();

  const booking = {
    id,
    user_id: req.user.id,
    type,
    title,
    detail: detail || "",
    price,
    confirm_id: confirmId,
    created_at: new Date().toISOString()
  };

  db.get("bookings").push(booking).write();
  db.set("nextBookingId", id + 1).write();

  res.status(201).json({ booking });
});

// ===== DELETE a booking =====
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  const existing = db.get("bookings").find({ id, user_id: req.user.id }).value();

  if (!existing) {
    return res.status(404).json({ error: "Booking not found" });
  }

  db.get("bookings").remove({ id }).write();
  res.json({ success: true });
});

module.exports = router;
