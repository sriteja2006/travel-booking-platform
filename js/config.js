// Set this to your deployed backend URL, e.g. "https://travel-platform-api.onrender.com"
// For local development with backend running on port 5000, leave as below.
const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000/api"
  : "https://travel-booking-platform-c0ei.onrender.com/api";
