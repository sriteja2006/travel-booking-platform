const express = require("express");
const router = express.Router();

// Mock data - replace with real API integrations
// (Amadeus for flights, Booking.com for hotels, Uber/Ola for cabs)

const FLIGHTS = [
  { id: "FL-1023", airline: "IndiGo", from: "DEL", to: "BLR", time: "06:00 - 08:45", price: 4500, stops: "Non-stop" },
  { id: "FL-1045", airline: "Air India", from: "DEL", to: "BLR", time: "09:30 - 12:20", price: 5200, stops: "Non-stop" },
  { id: "FL-1077", airline: "Vistara", from: "DEL", to: "BLR", time: "14:10 - 17:35", price: 4850, stops: "1 stop" },
  { id: "FL-1099", airline: "SpiceJet", from: "DEL", to: "BLR", time: "19:00 - 21:50", price: 4300, stops: "Non-stop" },
];

const HOTELS = [
  { id: "HT-201", name: "Sunrise Inn", location: "MG Road, Bengaluru", rating: 4.3, price: 2200, amenities: "Free WiFi · Breakfast included" },
  { id: "HT-202", name: "Grand Palace Hotel", location: "Indiranagar, Bengaluru", rating: 4.6, price: 3500, amenities: "Pool · Spa · Free WiFi" },
  { id: "HT-203", name: "City Comfort Stay", location: "Koramangala, Bengaluru", rating: 4.0, price: 1800, amenities: "Free WiFi · Parking" },
  { id: "HT-204", name: "Budget Nest", location: "Whitefield, Bengaluru", rating: 3.7, price: 1200, amenities: "Free WiFi" },
];

const CABS = [
  { id: "CB-301", type: "Hatchback", car: "Swift / similar", price: 600, eta: "5 mins" },
  { id: "CB-302", type: "Sedan", car: "Dzire / similar", price: 850, eta: "7 mins" },
  { id: "CB-303", type: "SUV", car: "Ertiga / similar", price: 1200, eta: "10 mins" },
];

router.get("/flights", (req, res) => {
  // req.query: from, to, date, travelers - use these with a real API
  res.json({ results: FLIGHTS });
});

router.get("/hotels", (req, res) => {
  // req.query: city, checkin, checkout, guests
  res.json({ results: HOTELS });
});

router.get("/cabs", (req, res) => {
  // req.query: pickup, drop, date, time, type
  res.json({ results: CABS });
});

module.exports = router;
