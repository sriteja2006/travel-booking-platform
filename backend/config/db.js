const FileSync = require("lowdb/adapters/FileSync");
const low = require("lowdb");
const path = require("path");

const adapter = new FileSync(path.join(__dirname, "..", "db.json"));
const db = low(adapter);

// Defaults
db.defaults({ users: [], bookings: [], nextUserId: 1, nextBookingId: 1 }).write();

module.exports = db;
